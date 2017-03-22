/*
 * name: table.js
 * version: v0.1.0
 * update: release
 * date: 2017-03-22
 */
//TODO: editer page 
define('table', function(require, exports, module) {
	"use strict";
	seajs.importStyle('', module.uri);
	require('dropdown');
	var $ = require('jquery'),
		base = require('base'),
		def = {
			el: null,
			data: null,
			column: null, // title,key,render,width,align,hook,ellipsis,editable,sortable,filterMethod,
			striped: false,
			bordered: false,
			condensed: false,
			hover: true,
			width: 0,
			height: 0,
			index: false,
			multi: false,
			noDataText: "暂无数据",
			noFilterText: '暂无筛选结果',
			highlight: false,
			onSelect: null // index, row, [array]
		},
		deepcopy = function (source) {
		    var sourceCopy = source instanceof Array ? [] : {};
		    for (var item in source) {
		        sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
		    }
		    return sourceCopy;
		},
		Table = function(config) {
			var opt = $.extend({}, def, config || {});
			if (!$(opt.el).length) {
				return null;
			}
			if (!$.isArray(opt.data) || !opt.data.length || !$.isArray(opt.column) || !opt.column.length) {
				return console.warn('table: data or column配置有误！');
			}
			if (isNaN(parseFloat(opt.width)) || !parseFloat(opt.width)) {
				opt.width = $(opt.el).width();
			}
			//加索引
			if (opt.index) {
				opt.column.unshift({
					type: 'index',
					width: 60,
					align: 'center',
					fixed: opt.index === 'fixed'
				});
			}
			//加复选框
			if (opt.multi) {
				opt.column.unshift({
					type: 'selection',
					width: 60,
					align: 'center',
					fixed: opt.multi === 'fixed'
				});
			}
			
			var tData = deepcopy(opt.data);
			//为索引生成唯一key
			var indexKey = 'index-' + base.getUUID();

			//生成单元格
			var getTd = function($this, rowIndex, rowData, col) {
				var tdStyler;
				var isDirty;
				var oriValue = opt.data[rowData[indexKey]][col.key];
				var thisColClass = ['row' + rowIndex + '-' + (col.key || '')];
				if(rowData[col.key]!==void(0) && (oriValue!==rowData[col.key])){
					//console.log(oriValue, rowData[col.key]);
					isDirty = true;
				}
				switch (col.align) {
					case 'center':
						thisColClass.push('tc');
						break;
					case 'right':
						thisColClass.push('tr');
						break;
					default:
						thisColClass.push('tl');
				}
				if(col.hook && col.hook.split){
					thisColClass.push(col.hook);
				}
				if(isDirty){
					thisColClass.push('table-cell-dirty');
				}
				if(col.editable){
					thisColClass.push('table-cell-editable');
				}
				if (typeof col.styler === 'function') {
					tdStyler = col.styler(rowData[col.key]) || '';
				}
				var thisColTag = '<td class="' + thisColClass.join(' ') + '"' + (tdStyler ? (' style="' + tdStyler + '"') : '') + '><div class="table-cell">';
				switch (col.type) {
					case 'index':
						thisColTag += ((parseInt(rowIndex) + 1) + '</td>');
						break;
					case 'selection':
						thisColTag += '<label class="checkbox checkbox-inline"><input type="checkbox" class="table-choose-input"></label></td>';
						break;
					default:
						var thisTagCont;
						var renderTagId = 'renderTagId-' + base.getUUID();
						var tdEntity = {
							set: function(key, newValue) {
								rowData[key] = newValue;
								var targetCol;
								$.each(opt.column, function(i, e) {
									if (e.key === key) {
										targetCol = e;
										return false;
									}
								});
								var targetTd = getTd($this, rowIndex, rowData, targetCol);
								$this.find('.row' + rowIndex + '-' + key).replaceWith(inject(targetTd));
							},
							toggle: function(key, newValue) {
								if (this['backup-'+key] === void 0) {
									this['backup-'+key] = opt.data[rowData[indexKey]][key];
									if (this['backup-'+key] !== void 0 && (this['backup-'+key] !== newValue)) {
										this.set(key, newValue);
									}
								} else {
									this.set(key, this['backup-'+key]);
									delete this['backup-'+key];
								}
							}, 
							get: function(full){
								if(full){
									return rowData;
								}else{
									return rowData[col.key];
								}
							},
							edit: function($dom){
								if(isEditing){
									return null;
								}
								if(!$dom || !$dom.length){
									$dom = $this.find('.row' + rowIndex + '-' + key + '.table-cell-editable');
								}
								if($dom.length){
									isEditing = true;
									var that = this;
									var valueType = typeof opt.data[rowData[indexKey]][col.key];
									var nowText = this.get();
									var inputHTML;
									if(valueType === 'number'){
										inputHTML = '<input type="number" class="form-control table-cell-editer" value="'+nowText+'" >';
									}else{
										inputHTML = '<textarea class="form-control table-cell-editer">'+nowText+'</textarea>';
									}
									var $input = $(inputHTML).on('blur',function(){
										var newValue = $(this).val();
										if(valueType === 'number'){
											newValue = isNaN(parseFloat(newValue)) ? 0 : parseFloat(newValue);
										}
										that.set(col.key, newValue);
										isEditing = false;
									});
									$dom.append($input);
									$input.focus();
								}else{
									console.warn('entity.edit()找不到当前TD单元格！',$dom);
								}
							}
						};
						opt.renderCollection = opt.renderCollection || [];
						if (typeof col.render === 'function') {
							try {
								opt.renderCollection.push({
									id: renderTagId,
									el: col.render(rowData[col.key], rowData, rowIndex, tdEntity),
									entity: tdEntity
								});
							} catch (e) {
								console.warn(col.key + ' => render() run error：', e.message);
							}
							thisTagCont = '<div id="' + renderTagId + '"></div>';
						} else {
							opt.renderCollection.push({
								id: renderTagId,
								el: (col.ellipsis ? '<div class="el" style="width:' + (col.thisColWidth - 36) + 'px">' + rowData[col.key] + '</div>' : ((rowData[col.key]) === null || rowData[col.key] === void(0)) ? opt.noDataText : rowData[col.key]),
								entity: tdEntity
							});
							thisTagCont = '<div id="' + renderTagId + '"></div>';
							//thisTagCont = (col.ellipsis ? '<div class="el" style="width:' + (col.thisColWidth - 36) + 'px">' + rowData[col.key] + '</div>' : ((rowData[col.key]) === null || rowData[col.key] === void(0)) ? opt.noDataText : rowData[col.key]);
						}
						thisColTag += (thisTagCont + '</div></td>');
				}
				return thisColTag;
			};
			//生成表格主体
			var getBody = function($this, tData, opt) {
				var tbodyCont = '';

				$.each(tData, function(rowIndex, rowData) {
					var thisdata = '<tr data-index="' + rowIndex + '">';
					if (rowData.split) {
						thisdata += ('<td>' + rowData + '</td>');
					} else if ($.isPlainObject(rowData)) {
						if(rowData[indexKey]===void(0)){
							rowData[indexKey] = parseInt(rowIndex);
						}
						$.each(opt.column, function(colIndex, colData) {
							thisdata += getTd($this, rowIndex, rowData, colData);
						});
					}
					thisdata += '</tr>';
					tbodyCont += thisdata;
				});
				return tbodyCont;
			};
			var render = function($this, tData, opt, part) {
				var colgroup = '<colgroup>';
				var theadCont = '<thead><tr>';
				var totalWidth = opt.width;
				var tableWidth = 0;
				var otherParts = opt.column.length;
				//收集注入元素
				opt.renderCollection = opt.renderCollection || [];
				var fixedIndex, fixedWidth = 0;
				$.each(opt.column, function(i, col) {
					//预计算列宽
					col.width = isNaN(parseFloat(col.width)) ? 0 : parseFloat(col.width);
					if (col.width) {
						totalWidth -= col.width;
						otherParts -= 1;
					}
					//fixed列位置
					if (col.fixed) {
						fixedIndex = i;
					}
				});

				$.each(opt.column, function(i, col) {
					var thisColWidth = col.width;
					var thisColClass = [];
					if (!thisColWidth) {
						thisColWidth = Math.max(Math.floor(totalWidth / otherParts), 60 + (col.sortable || $.isArray(col.filterMethod) ? 40 : 0));
					}
					if (fixedIndex !== void(0) && fixedIndex >= i) {
						opt.fixedIndex = fixedIndex;
						fixedWidth += thisColWidth;
					}
					tableWidth += thisColWidth;
					switch (col.align) {
						case 'center':
							thisColClass.push('tc');
							break;
						case 'right':
							thisColClass.push('tr');
							break;
						default:
							thisColClass.push('tl');
					}
					col.thisColWidth = thisColWidth;
					var thisColTag = '<th' + (' class="' + thisColClass.join(' ') + '">');
					colgroup += ('<col width="' + thisColWidth + '"></col>');
					switch (col.type) {
						case 'index':
							theadCont += (thisColTag + '#</th>');
							break;
						case 'selection':
							theadCont += (thisColTag + '<label class="checkbox checkbox-inline"><input type="checkbox" class="table-choose-all"></label></th>');
							break;
						default:
							var thisTagCont = '<div class="table-cell">';
							if (col.sortable || $.isArray(col.filterMethod)) {
								var renderTagId = 'sortTagId-' + base.getUUID();
								var $el = $('<div></div>');
								//排序
								if (col.sortable) {
									$el.append($('<span class="table-sort"><i class="ion table-sort-up">&#xe618;</i><i class="ion table-sort-down">&#xe612;</i></span>').on('click', '.ion', function() {
										var sortKey = [],
											sortData = [];
										if ($(this).hasClass('on')) {
											$(this).removeClass('on');
											sortData = tData;
										} else {
											$(this).addClass('on').siblings('.on').removeClass('on');
											$.each(tData, function(i, e) {
												sortKey.push(e[col.key]);
											});
											if ($(this).hasClass('table-sort-up')) {
												if (typeof col.sortable === 'function') {
													sortKey.sort(function(a, b) {
														return col.sortable(a, b, 'asc');
													});
												} else {
													sortKey.sort();
												}
											} else if ($(this).hasClass('table-sort-down')) {
												if (typeof col.sortable === 'function') {
													sortKey.sort(function(a, b) {
														return col.sortable(a, b, 'desc');
													});
												} else {
													sortKey.sort().reverse();
												}
											}
											$.each(sortKey, function(i, k) {
												$.each(tData, function(i, obj) {
													if (obj[col.key] === k) {
														sortData.push(obj);
													}
												});
											});
										}
										return render($this, sortData, opt, 'body');
									}));
								}
								//筛选
								if ($.isArray(col.filterMethod)) {
									var dropData = [{
										item: '全部'
									}];
									$.each(col.filterMethod, function(i, filterMethod) {
										if (filterMethod.label && filterMethod.label.split) {
											dropData.push({
												item: filterMethod.label,
												methodIndex: i
											});
										}
									});
									$el.append($('<span class="table-filter"><i class="ion">&#xe64d;</i></span>').dropdown({
										items: dropData,
										trigger: 'click',
										onclick: function(item, isCurrent) {
											if(isCurrent){
												return null;
											}
											var filterData;
											if (item.methodIndex === void(0)) {
												filterData = tData;
											} else if (typeof col.filterMethod[item.methodIndex].filter === 'function') {
												filterData = $.map(tData, function(val, i) {
													if (col.filterMethod[item.methodIndex].filter(val[col.key])) {
														return val;
													}
												});
											}
											if (!filterData.length) {
												filterData = [opt.noFilterText];
											}
											return render($this, filterData, opt, 'body');
										}
									}));
								}
								opt.renderCollection.push({
									id: renderTagId,
									el: $el.children('span').unwrap()
								});
								thisTagCont += (col.title || "#") + '<textarea style="display:none" id="' + renderTagId + '"></textarea>';
							} else {
								thisTagCont += (col.title || "#");
							}
							theadCont += (thisColTag + thisTagCont + '</div></th>');
					}
				});
				var tbodyCont = getBody($this, tData, opt);
				if (part === 'body') {
					//body局部更新
					var tbodyUpdate = inject(tbodyCont);
					if(opt.fixedIndex!==void(0)){
						var tbodyUpdateFixed = tbodyUpdate.clone(true);
						tbodyUpdateFixed.each(function(row, tr){
							$(tr).find('td').each(function(i, td){
								if(i > opt.fixedIndex){
									$(td).html('-').removeAttr('class');
								}
							});
						});
						tbodyUpdate.each(function(row,tr){
							$(tr).find('td').each(function(i, td){
								if(i <= opt.fixedIndex){
									$(td).html('-').removeAttr('class');
								}
							});
						});
						$this.find('.table-fixed .table-body tbody').html(tbodyUpdateFixed);
					}
					$this.data('data', tData).find('.table-wrapper>.table-body tbody').html(tbodyUpdate);
					return syncStatus($this);
				}
				var html = '<div class="table-wrapper' + (tableWidth > totalWidth ? ' table-scroll-x' : '') + '" style="width:' + opt.width + 'px">';
				var thead = '<div class="table-header" style="width:' + tableWidth + 'px"><table class="table">';
				theadCont += '</tr></thead>';
				colgroup += '</colgroup>';
				thead += colgroup;
				thead += theadCont;
				thead += '</table></div>';
				var tbody = '<div class="table-body" style="width:' + tableWidth + 'px"><table class="table' + (opt.hover ? ' table-hover' : '') + (opt.condensed ? ' table-condensed' : '') + (opt.bordered ? ' table-bordered' : '') + (opt.striped ? ' table-striped' : '') + '" style="width:' + tableWidth + 'px">';
				tbody += colgroup;
				tbody += ('<tbody>' + tbodyCont + '</tbody>');
				tbody += '</table></div>';
				html += thead;
				html += tbody;
				if (fixedWidth) {
					var tfixed = '';
					tfixed = '<div class="table-fixed" style="width:' + fixedWidth + 'px">';
					tfixed += thead;
					tfixed += tbody;
					tfixed += '</div>';
					html += tfixed;
				}
				html += '</div>';
				return $this.data('data', tData).html(inject(html, true));
			};
			var inject = function(html, isInit) {
				var tableObj = $(html);
				var $fixed = tableObj.children('.table-fixed');
				if (isInit) {
					//初始化高度
					if (opt.height && !isNaN(parseFloat(opt.height))) {
						var trueHeight;
						tableObj.height(opt.height);
						trueHeight = tableObj.height();
						tableObj.find('.table-body').height(trueHeight - 43);
					}
					//初始化滚动同步
					if ($fixed.length) {
						tableObj.on('scroll', function(e) {
							$fixed.css('left', $(this).scrollLeft());
						}).children('.table-body').on('scroll', function() {
							$fixed.children('.table-body').scrollTop($(this).scrollTop());
						});
						if (opt.hover) {
							tableObj.children('.table-body').on('mouseenter', 'tr', function() {
								$fixed.find('.table-body tr').eq($(this).index()).addClass('table-tr-hover');
							}).on('mouseleave', 'tr', function() {
								$fixed.find('.table-body tr').eq($(this).index()).removeClass('table-tr-hover');
							});
							$fixed.children('.table-body').on('mouseenter', 'tr', function() {
								tableObj.find('.table-body tr').eq($(this).index()).addClass('table-tr-hover');
							}).on('mouseleave', 'tr', function() {
								tableObj.find('.table-body tr').eq($(this).index()).removeClass('table-tr-hover');
							});
						}
					}
				}
				if(opt.fixedIndex!==void(0) && $fixed.length){
					$fixed.find('.table-body tr').each(function(row, tr){
						$(tr).find('td').each(function(i, td){
							if(i > opt.fixedIndex){
								$(td).html('-').removeAttr('class');
							}
						});
					});
					tableObj.children('.table-body tr').each(function(row,tr){
						$(tr).find('td').each(function(i, td){
							if(i <= opt.fixedIndex){
								$(td).html('-').removeAttr('class');
							}
						});
					});
				}
				$.each(opt.renderCollection, function(i, renderObj) {
					if (renderObj.entity) {
						tableObj.find('#' + renderObj.id).parents('td').data('entity', renderObj.entity);
					}
					tableObj.find('#' + renderObj.id).replaceWith(renderObj.el);
				});
				delete opt.renderCollection;
				return tableObj;
			};
			var multiCollection = [];
			var syncStatus = function(tableObj) {
				tableObj.find('.table-body').each(function(tindex, table) {
					$(table).find('tr').each(function(i, tr) {
						var isIn = false;
						$.each(multiCollection, function(i, choosen) {
							if ($(tr).data('index') === choosen[indexKey]) {
								isIn = true;
								return false;
							}
						});
						$(tr).find('.table-choose-input').prop('checked', isIn);
						if (opt.highlight) {
							if (isIn) {
								$(tr).addClass('table-highlight');
							} else {
								$(tr).removeClass('table-highlight');
							}
						}
					});
				});
				if (opt.multi) {
					tableObj.find('.table-header .table-choose-all').prop('checked', multiCollection.length === tData.length);
				}
			};
			var isEditing;
			var generate = function($this, tData, opt, part) {
				render($this, tData, opt, part);
				if ($this.data('table-events')) return null;
				$this.data('table-events', true);
				//绑定事件
				$this.on('click', 'td.table-cell-editable', function(e){
					var entity = $(this).data('entity');
					entity.edit($(this));
				});
				if (opt.multi) {
					$this.on('click', '.table-body tr', function(e) {
						var index = $(this).data('index'),
							row = parseInt($(this).data('index'));
						if ($(e.target).parents('td').find('.table-choose-input').length) {
							var isSelect = $(e.target).parents('td').find('.table-choose-input').prop('checked');
							if (isSelect) {
								multiCollection.push($this.data('data')[index]);
							} else {
								$.each(multiCollection, function(i, c) {
									if (c[indexKey] === row) {
										multiCollection.splice(i, 1);
										return false;
									}
								});
							}
							if (typeof opt.onSelect === 'function') {
								opt.onSelect($(this).data('index'), $this.data('data')[index], multiCollection);
							}
						}
						syncStatus($this);
					}).on('click', '.table-choose-all', function() {
						if (multiCollection.length === $this.data('data').length) {
							multiCollection = [];
						} else {
							multiCollection = $this.data('data');
						}
						if (typeof opt.onSelect === 'function') {
							opt.onSelect('all', null, multiCollection);
						}
						syncStatus($this);
					});
				} else {
					$this.on('click', '.table-body tr', function(e) {
						var index = $(this).data('index'),
							row = parseInt($(this).data('index'));
						if (multiCollection.length && (row === multiCollection[0][indexKey])) {
							multiCollection = [];
						} else {
							multiCollection = [$this.data('data')[row]];
							if (typeof opt.onSelect === 'function') {
								opt.onSelect($(this).data('index'), $this.data('data')[row], multiCollection);
							}
						}
						syncStatus($this);
					});
				}
			};
			$(opt.el).each(function(i, e) {
				generate($(e), tData, opt);
			});
			return {
				data: function(data) {
					if (data && $.isArray(data)) {
						tData = data;
						$(opt.el).each(function(i, e) {
							generate($(e), tData, opt);
						});
					} else {
						return $(opt.el).data('data');
					}
				}
			};
		};

	$.fn.table = function(config) {
		return Table($.extend(config || {}, {
			el: this
		}));
	};
	module.exports = Table;
});