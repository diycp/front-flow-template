(function(seajs){
    var mod = {
        'audio/audio'                       : 'v1.0.1',
        'copy/ZeroClipboard'                : 'v0.0.1',
        'flv/flv'                           : 'v0.0.2',
        'jquery/1/jquery'                   : 'v1.11.3',
        'jquery/2/jquery'                   : 'v2.1.4',
        'jquery/3/jquery'                   : 'v3.1.1',
        'raty/raty'                         : 'v0.1.0',
        'upload/upload'                     : 'v1.1.1',
        'upload/makethumb'                  : 'v0.0.1',
        'upload/localResizeIMG'             : 'v0.0.1',
        'validform/validform'               : 'v2.4.5',
        'video/video'                       : 'v0.0.1',
        'webuploader/webuploader'           : 'v1.0.0',
        'album'                             : 'v2.2.13',
        'appcan'                            : 'v0.1.0',
        'autocomplete'                      : 'v0.1.0',
        'badge'                             : 'v0.0.1',
        'base'                              : 'v3.3.3',
        'bdshare'                           : 'v3.1.2',
        'box'                               : 'v3.11.4',
        'city-select'                       : 'v1.0.2',
        'countdown'                         : 'v1.1.1',
        'datepicker'                        : 'v2.0.2',
        'drag'                              : 'v0.8.0',
        'drag-panel'                        : 'v0.0.2',
        'dropdown'                          : 'v0.2.3',
        'easing'                            : 'v0.0.1',
        'echarts'                           : 'v0.1.0',
        'etpl'                              : 'v0.1.1',
        'img-loaded'                        : 'v0.0.1',
        'img-ready'                         : 'v1.0.0',
        'input-number'                      : 'v0.1.3',
        'input'                             : 'v0.1.1',
        'instantclick'                      : 'v0.0.1',
        'label'                             : 'v0.0.1',
        'lazyload'                          : 'v2.1.0',
        'marquee'                           : 'v0.10.1',
        'masonry'                           : 'v0.0.1',
        'menu'                              : 'v0.1.1',
        'mousemenu'                         : 'v1.0.1',
        'mousetrap'                         : 'v1.5.3',
        'mousewheel'                        : 'v0.0.1',
        'notice'                            : 'v0.0.2',
        'offcanvas'                         : 'v2.0.4',
        'on-scroll'                         : 'v2.1.3',
        'page'                              : 'v1.0.3',
        'paging-load'                       : 'v0.0.1',
        'pjax'                              : 'v0.0.1',
        'placeholder'                       : 'v0.0.1',
        'progress'                          : 'v0.0.3',
        'qr'                                : 'v0.1.0',
        'responsive'                        : 'v0.0.1',
        'scroll-bar'                        : 'v2.2.8',
        'scroll-col'                        : 'v4.2.4',
        'scroll-load'                       : 'v1.0.0',
        'scroll-row'                        : 'v3.0.6',
        'select'                            : 'v4.3.2',
        'sendcode'                          : 'v0.2.0',
        'slide'                             : 'v4.2.2',
        'slider'                            : 'v0.0.2',
        'spin'                              : 'v0.0.2',
        'switch'                            : 'v0.3.0',
        'tab'                               : 'v3.0.0',
        'table'                             : 'v1.5.0',
        'timepicker'                        : 'v0.1.1',
        'tip'                               : 'v1.5.0',
        'touch'                             : 'v0.1.1',
        'zoom'                              : 'v2.0.4'
    };
    var manifest = {};
    for(var key in mod){
        manifest[seajs.data.base + key + '.js'] = mod[key];
    }
    if(seajs.data.localcache){
        seajs.data.localcache.manifest = manifest;
    }else{
        seajs.data.localcache = {
            timeout: 2e4,
            manifest: manifest
        };
    }
})(seajs);