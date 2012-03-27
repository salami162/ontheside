(function( $ ){

    var TEXTILE = 'textile';

    var methods = {
        init : function( options ) {
            return this.each(function(){
                var $this = $(this),
                    settings = $this.data(TEXTILE);
                
                options = (options == undefined) ? {} : options;
                $.extend(true, settings, options );
                $this.data(TEXTILE, settings);
                
                if(settings.advanced_mode) {
                    methods["style_advanced"].apply($this);                        
                }   
                else {
                    methods["style_simple"].apply($this);                        
                }              
            });
        },
        destroy : function( ) {
            return this.each(function(){
                var $this = $(this),
                    settings = $this.data(TEXTILE);

                // Namespacing FTW
                $(window).unbind('.textile'); // we might not need this.
                settings.textile.remove();  // we might need this
                $this.removeData(TEXTILE);
            });

        },
        convert : function( input_html ) {
            var $this = $(this),
                settings = $this.data(TEXTILE);
                
            var lstlev=0,lst="",elst="",intable=0,mm="";
            var aliases = [];
            
            var lines = (!input_html)? settings.input_section.val().split(/\r?\n/) : input_html.split(/\r?\n/);
            settings.html_output.html = "";
            settings.html_output.inpr = settings.html_output.inbq = settings.html_output.inbqq = 0;
            
            for(var i = 0 ; i < lines.length ; i++) {
                if(lines[i].indexOf("[") == 0 && lines[i].indexOf("]") > 0) {
                    var m = lines[i].indexOf("]");
                    aliases[lines[i].substring(1,m)]=lines[i].substring(m+1);
                }
            }
            for(i = 0; i < lines.length ; i++) {
                // Add code :Start
                if (lines[i].match(/\s*-{4,}\s*/)){
                  settings.html_output.html += "<hr/>\n";
                  continue;
                }
                // Add code :End
                if (lines[i].indexOf("[") == 0 && lines[i].indexOf("]") > 0) { // match [language]
                    continue;
                }
                if( mm = settings.para.exec(lines[i])){
                    $this.data(TEXTILE, settings);
                    methods["stp"].apply($this, [1]);
                    settings = $this.data(TEXTILE);
                    
                    settings.html_output.inpr = 1;
                    var attr_return = methods["make_attr"].apply($this, [mm[1]]);
                    var prep_return = methods["prep"].apply($this, [mm[2], aliases]);
                    settings.html_output.html += lines[i].replace(settings.para, "<p" + attr_return + ">" + prep_return);
                    continue;
                }
                if(mm = /^h(\d)(\S*)\.\s*(.*)/.exec(lines[i])){
                    $this.data(TEXTILE, settings);
                    methods["stp"].apply($this, [1]);
                    settings = $this.data(TEXTILE);

                    var attr_return = methods["make_attr"].apply($this, [mm[2]]);
                    var prep_return = methods["prep"].apply($this, [mm[3], aliases]);
                    settings.html_output.html += methods["tag"].apply($this,["h"+ mm[1], attr_return, prep_return]) + settings.line;
                    continue;
                }
                if(mm = settings.rfn.exec(lines[i])){
                    $this.data(TEXTILE, settings);
                    methods["stp"].apply($this, [1]);
                    settings = $this.data(TEXTILE);

                    settings.html_output.inpr = 1;
                    settings.html_output.html += lines[i].replace(settings.rfn,'<p id="fn' + mm[1] + '"><sup>' + mm[1] + '<\/sup>' + methods["prep"].apply($this, [mm[2], aliases]));
                    continue;
                }
                if (lines[i].indexOf("*") == 0 && lines[i].match(/\*/g).length == 1) {
                    lst="<ul>";
                    elst="<\/ul>";
                }
                else if (lines[i].indexOf("#") == 0) {
                    lst="<\ol>";
                    elst="<\/ol>";
                }
                else {
                    while (lstlev > 0) {
                        settings.html_output.html += elst;
                        if(lstlev > 1){
                            settings.html_output.html += "<\/li>";
                        } else {
                            settings.html_output.html += "\n";
                        }
                        settings.html_output.html += "\n";
                        lstlev--;
                    }
                    lst="";
                }
                if(lst) {
                    $this.data(TEXTILE, settings);
                    methods["stp"].apply($this, [1]);
                    settings = $this.data(TEXTILE);

                    var m = /^([*#]+)\s*(.*)/.exec(lines[i]);
                    var lev = m[1].length;
                    while(lev < lstlev) {
                        settings.html_output.html += elst + "<\/li>\n"; 
                        lstlev--;
                    }
                    while(lstlev < lev) {
                        settings.html_output.html = settings.html_output.html.replace(/<\/li>\n$/,"\n"); 
                        settings.html_output.html += lst;
                        lstlev++;
                    }
                    var prep_return = methods["prep"].apply($this, [m[2], aliases]);
                    settings.html_output.html += methods["tag"].apply($this, ["li","",prep_return]) + "\n";
                    continue;
                }
                if (lines[i].match(settings.table)){
                    $this.data(TEXTILE, settings);
                    methods["stp"].apply($this, [1]);
                    settings = $this.data(TEXTILE);

                    intable=1;
                    settings.html_output.html += lines[i].replace(settings.table,'<table style="$1;">\n');
                    continue;
                }
                if ((lines[i].indexOf("|") == 0)  || (lines[i].match(settings.trstyle)) ) {
                    methods["stp"].apply($this, [1]);
                    if(!intable) {settings.html_output.html += "<table>\n";intable=1;}
                    var rowst="";
                    var trow="";
                    var ts = settings.trstyle.exec(lines[i]);
                    if(ts){
                        rowst = methods["qat"].apply($this,['style',ts[1]]);
                        lines[i]=lines[i].replace(settings.trstyle,"\|");
                    }
                    var cells = lines[i].split("|");
                    for(j=1;j<cells.length-1;j++) {
                        var ttag="td";
                        if(cells[j].indexOf("_.")==0) { ttag="th"; cells[j]=cells[j].substring(2);}
                        cells[j] = methods["prep"].apply($this, [cells[j], aliases]); //prep(cells[j]);
                        var al=/^([<>=^~\/\\\{]+.*?)\.(.*)/.exec(cells[j]);
                        var at="",st="";
                        if(al != null) {
                            cells[j]=al[2];
                            var cs= /\\(\d+)/.exec(al[1]);if(cs != null){at += methods["qat"].apply($this,['colspan',cs[1]]);}
                            var rs= /\/(\d+)/.exec(al[1]);if(rs != null){at += methods["qat"].apply($this,['rowspan',rs[1]]);}
                            var va= /([\^~])/.exec(al[1]);if(va != null){st += "vertical-align:" + methods["alg"].apply($this,[va[1]]) + ";";}
                            var ta= /(<>|=|<|>)/.exec(al[1]);if(ta != null){st +="text-align:" + methods["alg"].apply($this,[ta[1]]) + ";";}
                            var is= /\{([^\}]+)\}/.exec(al[1]);if(is != null){st += is[1];}
                            if(st != ""){ at += methods["qat"].apply($this,['style', st]);}                 
                        }
                        trow += methods["tag"].apply($this, [ttag, at, cells[j]]); //tag(ttag,at,cells[j]);
                    }
                    settings.html_output.html += "\t" + methods["tag"].apply($this, ["tr",rowst,trow]) + "\n";
                    continue;
                }
                if(intable) {settings.html_output.html += "<\/table>"+ settings.line; intable=0;}
          
                if (lines[i]=="") {
                    $this.data(TEXTILE, settings);
                    methods["stp"].apply($this, []);
                    settings = $this.data(TEXTILE);
                }
                else if (!settings.html_output.inpr) {
                    if( mm = settings.bq.exec(lines[i])){
                        lines[i]=lines[i].replace(settings.bq,"");
                        settings.html_output.html +="<blockquote>";
                        settings.html_output.inbq=1;
                        if(mm[1]) {settings.html_output.inbqq = 1;}
                    }
                    settings.html_output.html += "<p>" + methods["prep"].apply($this, [lines[i]]);
                    settings.html_output.inpr = 1;
                }
                else {settings.html_output.html += methods["prep"].apply($this, [lines[i]]);}
            }
            $this.data(TEXTILE, settings);
            methods["stp"].apply($this, []);
            settings = $this.data(TEXTILE);
            return settings.html_output.html;
        },
  
        prep: function(m, aliases){
            var $this = $(this),
                settings = $this.data(TEXTILE);

            for(i in settings.ent) { 
                m = m.replace(new RegExp(i,"g"), settings.ent[i]);
            }
            for(i in settings.tags) {
                m = methods["make_tag"].apply($this,[m, RegExp("^"+settings.tags[i]+"(.+?)"+settings.tags[i]), i, ""]);// make_tag(m, RegExp("^"+settings.tags[i]+"(.+?)"+settings.tags[i]), i, "");
                m = methods["make_tag"].apply($this,[m, RegExp(" "+settings.tags[i]+"(.+?)"+settings.tags[i]), i, " "]); //make_tag(m, RegExp(" "+settings.tags[i]+"(.+?)"+settings.tags[i]), i, " ");
            }
            m = m.replace(/\[(\d+)\]/g,'<sup><a href="#fn$1">$1<\/a><\/sup>');
            m = m.replace(/([A-Z]+)\((.*?)\)/g,'<acronym title="$2">$1<\/acronym>');
            m = m.replace(/\"([^\"]+)\":((http|https|mailto):\S+)/g,'<a href="$2">$1<\/a>');
            m = methods["make_image"].apply($this, [m, /!([^!\s]+)!:(\S+)/]); //make_image(m, /!([^!\s]+)!:(\S+)/);
            m = methods["make_image"].apply($this, [m, /!([^!\s]+)!/]); //make_image(m, /!([^!\s]+)!/);
            m = m.replace(/"([^\"]+)":(\S+)/g, function($0 ,$1 ,$2){
                    var qat_return = methods["qat"].apply($this, ['href',aliases[$2]]); //qat('href',aliases[$2])
                    return methods["tag"].apply($this,["a", qat_return, $1]);
                });
            m = m.replace(/(=)?"([^\"]+)"/g, function($0, $1, $2){
                    return ($1)?$0:"&#8220;"+$2+"&#8221;"
                });
            return m;
        },
  
        make_tag: function (source, regex, tag, space) {
            var $this = $(this),
                settings = $this.data(TEXTILE);

            while(m = regex.exec(source)) {
                var st = methods["make_attr"].apply($this, [m[1]]);
                m[1] = m[1].replace(/^[\[\{\(]\S+[\]\}\)]/g,"");
                m[1] = m[1].replace(/^[<>=()]+/,"");
                var tag_return = methods['tag'].apply($this, [tag, st, m[1]]);
                source = source.replace(regex, space + tag_return);
            }
            return source;
        },
  
        make_image: function (source, regex) {
            var ma = regex.exec(source);
            if(ma != null) {
                var attr="";
                var st="";
                var at = /\((.*)\)$/.exec(ma[1]);
                if(at != null) {
                    var alt_return = methods['qat'].apply($this, ['alt', at[1]]);
                    var title_return = methods['qat'].apply($this, ['title', at[1]]);
                    attr = alt_return + title_return;
                    ma[1] = ma[1].replace(/\((.*)\)$/,"");
                }
                if(ma[1].match(/^[><]/)) {
                    st = "float:"+((ma[1].indexOf(">")==0)?"right;":"left;");
                    ma[1] = ma[1].replace(/^[><]/,"");
                }
                
                var pdl = /(\(+)/.exec(ma[1]);
                if(pdl){
                    st += "padding-left:"+pdl[1].length+"em;";
                }
                
                var pdr = /(\)+)/.exec(ma[1]);
                if(pdr){
                    st += "padding-right:"+pdr[1].length+"em;";
                }
                
                if(st){
                    attr += methods['qat'].apply($this, ['style', st]); //qat('style',st);
                }
                
                var im = '<img src="'+ma[1]+'"'+attr+" />";
                if(ma.length >2) {
                    var qat_return = methods['qat'].apply($this, ['href', ma[2]]);
                    im = methods['tag'].apply($this, ['a', qat_return, im]); //tag('a',qat('href',ma[2]),im);
                }
                source = source.replace(re,im);
            }
            return source;
        },
  
        make_attr : function (source) {
            var $this = $(this),
                settings = $this.data(TEXTILE);

            var st="";
            var at="";
            if(!source){return "";}
            var l=/\[(\w\w)\]/.exec(source);
            if(l != null) {
                at += methods['qat'].apply($this, ['lang', l[1]]);//qat('lang',l[1]);
            }
            var ci=/\((\S+)\)/.exec(source);
            if(ci != null) {
                source = source.replace(/\((\S+)\)/,"");
                at += ci[1].replace(/#(.*)$/,' id="$1"').replace(/^(\S+)/,' class="$1"');
            }
            var ta= /(<>|=|<|>)/.exec(source);
            if(ta){
                st +="text-align:"+settings.alg[ta[1]]+";";}
            var ss=/\{(\S+)\}/.exec(source);
            if(ss){
                st += ss[1];
                if(!ss[1].match(/;$/)){st+= ";";}
            }
            var pdl = /(\(+)/.exec(source);
            if(pdl){
                st+="padding-left:"+pdl[1].length+"em;";
            }
            var pdr = /(\)+)/.exec(source);
            if(pdr){
                st+="padding-right:"+pdr[1].length+"em;";
            }
            if(st) {
                at += methods['qat'].apply($this, ['style', st]);//qat('style',st);
            }
            return at;
        },
  
        qat: function(a,v){
            return ' '+ a + '="' + v + '"';
        },
        
        tag: function(t,a,c) {
            return "<"+t+a+">"+c+"</"+t+">";
        },
        
        stp: function (b){
            var $this = $(this),
                settings = $this.data(TEXTILE);

            if(b){
                settings.html_output.inbqq = 0;
            }
            if(settings.html_output.inpr){ 
                settings.html_output.html += "<\/p>"+ settings.line;
                settings.html_output.inpr = 0;
            }
            if(settings.html_output.inbq && !settings.html_output.inbqq){ 
                settings.html_output.html += "<\/blockquote>"+ settings.line;
                settings.html_output.inbq = 0;
            }
            $this.data(TEXTILE, settings);
        },
        
        style_simple: function(){
            var $this = $(this),
                settings = $this.data(TEXTILE);
                
            settings.input_section.addClass("wiki_input").css("float","left").wrap('<div class="wiki_container"></div>');
            // "preview" button
            settings.preview_btn = $('<div style="float: left;"><span class="ui-icon ui-icon-print" style="margin-top: 1px; cursor:pointer;" title="Preview"></span></div>');
            settings.preview_btn.insertAfter(settings.input_section);
            settings.preview_btn.bind("click", function(e){
                var html_string = methods["convert"].apply($this);
                methods["preview"].apply($this, [html_string]);
            });
            // "advanced mode" button
            settings.advanced_btn = $('<div style="float: left;"><span class="ui-icon ui-icon-newwin" style="margin-top: 1px; cursor:pointer;" title="Advanced Mode"></span></div>');
            settings.advanced_btn.insertAfter(settings.preview_btn);
            settings.advanced_btn.bind("click", function(e){
                var popup_dialog = $('<div class="wiki_dialog"></div>');
                var clone_dom = settings.input_section.clone();
                clone_dom.val(settings.input_section.val());
                clone_dom.appendTo(popup_dialog);
                popup_dialog.insertAfter(settings.preview_section);
                popup_dialog.find('.wiki_input').textile({advanced_mode:true});
                popup_dialog.dialog({
                    width: 740,
                    height: 422,
                    autoOpen: false,
                    modal: true,
                    show: "blind",
                    hide: "blind",
                    close: function (event, ui) {
                        settings.input_section.val(popup_dialog.find(".wiki_input").val());
                        popup_dialog.remove();
                    }
                });
                popup_dialog.dialog( "open" );
            });

            $this.data(TEXTILE, settings);
        },
        
        style_advanced: function() {
            var $this = $(this),
                settings = $this.data(TEXTILE);
            
            // -------------------------------------------------------------------
            // markItUp!
            // -------------------------------------------------------------------
            // Copyright (C) 2008 Jay Salvat
            // http://markitup.jaysalvat.com/
            // -------------------------------------------------------------------
            // Textile tags example
            // http://en.wikipedia.org/wiki/Textile_(markup_language)
            // http://www.textism.com/
            // -------------------------------------------------------------------
            // Feel free to add more tags
            // -------------------------------------------------------------------
            var mySettings = {
                previewParser: (function(e) {
                    var html_string = methods["convert"].apply($this);
                    return html_string;
                }),
                previewParserPath:  '', // path to your Textile parser
                onShiftEnter:       {keepDefault:false, replaceWith:'\n\n'},
                markupSet: [
                    {name:'Heading 1', key:'1', openWith:'h1(!(([![Class]!]))!). ', placeHolder:'Your title here...' },
                    {name:'Heading 2', key:'2', openWith:'h2(!(([![Class]!]))!). ', placeHolder:'Your title here...' },
                    {name:'Heading 3', key:'3', openWith:'h3(!(([![Class]!]))!). ', placeHolder:'Your title here...' },
                    {name:'Heading 4', key:'4', openWith:'h4(!(([![Class]!]))!). ', placeHolder:'Your title here...' },
                    {name:'Heading 5', key:'5', openWith:'h5(!(([![Class]!]))!). ', placeHolder:'Your title here...' },
                    {name:'Heading 6', key:'6', openWith:'h6(!(([![Class]!]))!). ', placeHolder:'Your title here...' },
                    {name:'Paragraph', key:'P', openWith:'p(!(([![Class]!]))!). '},
                    {separator:'---------------' },
                    {name:'Bold', key:'B', closeWith:'*', openWith:'*'},
                    {name:'Italic', key:'I', closeWith:'_', openWith:'_'},
                    {name:'Stroke through', key:'S', closeWith:'-', openWith:'-'},
                    {separator:'---------------' },
                    {name:'Bulleted list', openWith:'(!(* |!|*)!)'},
                    {name:'Numeric list', openWith:'(!(# |!|#)!)'}, 
                    {separator:'---------------' },
                    {name:'Picture', replaceWith:'![![Source:!:http://]!]([![Alternative text]!])!'}, 
                    {name:'Link', openWith:'"', closeWith:'([![Title]!])":[![Link:!:http://]!]', placeHolder:'Your text to link here...' },
                    {separator:'---------------' },
                    {name:'Quotes', openWith:'bq(!(([![Class]!]))!). '},
                    {name:'Code', openWith:'@', closeWith:'@'},
                    {separator:'---------------' },
                    {name:'Preview', call:'preview', className:'preview'},
                    {separator:'---------------' },
                    {name:'Help', call:'helplink', className:'helplink'},
                    {separator:'---------------' }
                ]
            }; 
        
            var mark_it_up = settings.input_section.markItUp(mySettings);
            var preview_btn = $(mark_it_up).parent().find('li.preview');
        },
        
        preview: function(html_string) {
            var $this = $(this),
                settings = $this.data(TEXTILE); 
            var preview_dialog = $('<div class="wiki_preview" style="float: left; margin-left:5px;"></div>');
            preview_dialog.insertAfter(settings.advanced_btn);
            preview_dialog.dialog({
                    width: 450,
                    height: 100,
                    autoOpen: false,
                    modal: true,
                    show: "blind",
                    hide: "blind",
                    close: function (event, ui) {
                        preview_dialog.remove();
                    }
            });
            preview_dialog.html(html_string); 
            preview_dialog.dialog("open");     
        }

    };

$.fn.textile = function( method ) {    
    
    var settings = $(this).data(TEXTILE);    
    if (!settings) { 
        settings = {
            input_section: $(this),
            advanced_mode: false ,                      
            alg : {'>':'right','<':'left','=':'center','<>':'justify','~':'bottom','^':'top'},
            ent : {"'":"&#8217;"," - ":" &#8211; ","--":"&#8212;"," x ":" &#215; ","\\.\\.\\.":"&#8230;","\\(C\\)":"&#169;","\\(R\\)":"&#174;","\\(TM\\)":"&#8482;"},
            tags : {"b":"\\*\\*","i":"__","em":"_","strong":"\\*","cite":"\\?\\?","sup":"\\^","sub":"~","span":"\\%","del":"-","code":"@","ins":"\\+","del":"-"},
            line : "\n\n",
            para : /^p(\S*)\.\s*(.*)/,
            rfn : /^fn(\d+)\.\s*(.*)/,
            bq : /^bq\.(\.)?\s*/,
            table : /^table\s*{(.*)}\..*/,
            trstyle : /^\{(\S+)\}\.\s*\|/,
            html_output: {
                inpr: 0 ,
                inbq: 0,
                inbqq: 0,
                html : ""
            }
        };
    }
    $(this).data(TEXTILE, settings);

    if ( methods[method] ) {
        return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } 
    else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply( this, arguments );
    } 
    else {
        $.error( 'Method ' +  method + ' does not exist on jQuery.textile' );
    }    
  
  };

})( jQuery );