(function(seajs){
    var mod = {
        'audio/audio'                       : 'v1.0.1',
        'copy/ZeroClipboard'                : 'v0.0.1',
        'flv/flv'                           : 'v0.0.2',
        'jquery/1/jquery'                   : 'v1.11.3',
        'jquery/2/jquery'                   : 'v2.1.4',
        'My97DatePicker/WdatePicker'        : 'v0.0.1',
        'raty/raty'                         : 'v0.1.0',
        'upload/upload'                     : 'v1.1.0',
        'upload/makethumb'                  : 'v0.0.1',
        'upload/localResizeIMG'             : 'v0.0.1',
        'validform/validform'               : 'v2.4.2',
        'video/video'                       : 'v0.0.1',
        'webuploader/webuploader'           : 'v1.0.0',
        'album'                             : 'v2.2.10',
        'appcan'                            : 'v0.1.0',
        'autocomplete'                      : 'v0.0.1',
        'base'                              : 'v3.1.3',
        'bdshare'                           : 'v3.1.2',
        'box'                               : 'v3.10.5',
        'city-select'                       : 'v0.0.7',
        'countdown'                         : 'v1.1.0',
        'datepicker'                        : 'v1.0.0',
        'drag'                              : 'v0.7.1',
        'easing'                            : 'v0.0.1',
        'echarts'                           : 'v0.0.2',
        'etpl'                              : 'v0.0.1',
        'fastclick'                         : 'v0.0.1',
        'img-loaded'                        : 'v0.0.1',
        'img-ready'                         : 'v1.0.0',
        'input-number'                      : 'v0.0.2',
        'instantclick'                      : 'v0.0.1',
        'lazyload'                          : 'v2.1.0',
        'marquee'                           : 'v0.10.1',
        'masonry'                           : 'v0.0.1',
        'mousemenu'                         : 'v1.0.0',
        'mousetrap'                         : 'v1.5.3',
        'mousewheel'                        : 'v0.0.1',
        'offcanvas'                         : 'v2.0.4',
        'on-scroll'                         : 'v2.1.3',
        'page'                              : 'v0.0.1',
        'photowall'                         : 'v0.1.1',
        'pjax'                              : 'v0.0.1',
        'placeholder'                       : 'v0.0.1',
        'qr'                                : 'v0.1.0',
        'responsive'                        : 'v0.0.1',
        'scroll-bar'                        : 'v2.2.7',
        'scroll-col'                        : 'v4.2.4',
        'scroll-load'                       : 'v1.0.0',
        'scroll-row'                        : 'v3.0.6',
        'select'                            : 'v4.1.0',
        'sendcode'                          : 'v0.0.1',
        'slide'                             : 'v4.1.8',
        'tab'                               : 'v2.1.2',
        'tip'                               : 'v1.2.4',
        'touch'                             : 'v0.1.1',
        'zoom'                              : 'v2.0.2'
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