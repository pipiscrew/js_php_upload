(function( $ ) {
 
$.fn.upload = function(options ) {

    //default options 
    var opts = $.extend({}, $.fn.upload.defaults, options);
 
    //store html element names to variables
    var file_element="#"+this.attr('id');
    var drop_element="#"+this.attr('id')+"_zone";
    var drop_list="#"+this.attr('id')+"_list";
 
    //enable dataTransfer property
    //http://stackoverflow.com/a/14792183/1320686
    //http://api.jquery.com/category/events/event-object/
    jQuery.event.props.push('dataTransfer');
 
    //return this.each( function() {

        //the event of file:input control (change) fire when 'browse for file' or 'drop files'
        $( this ).change(function (){
            var files = $(this).prop("files")
            handleFileSelect(files, true);
        }); 
 
    //plugin method (aka .refresh())
    $.fn.reset = function() {
        $(drop_list).html('');
        $(drop_element).data("filename", "0.jpg");
        //clear file:input control
        //https://css-tricks.com/snippets/jquery/clear-a-file-input/#comment-534596
        $(file_element).val('') ;
    };
    // });
 
    function handleFileSelect(evt,is_file_choose) {
        //when start processing the files, remove the hover css (if any)
        $(drop_element).removeClass("dropstylehover");
 
        // files is a FileList of File objects. List some properties.
        var files;
 
        //when files dropped
        if (!is_file_choose){
            evt.stopPropagation();
            evt.preventDefault();
 
            files = evt.dataTransfer.files; // FileList object.
        }
        else {
            files = evt
        }
 
        var output = [];
 
        var file_total_limit;
 
        //plugin option single
        if (opts.single==1)
            file_total_limit = 1;
        else
            file_total_limit = files.length;
 
        //get ftp_filename by HTML5 tag (used to set the filename dynamic)
        if ($(drop_element).data('filename')!=null)
            opts.ftp_filename = $(drop_element).data('filename');
 
        for (var i = 0; i < file_total_limit; i++) {
          var f = files[i];
 
          output.push('<li><span style="margin-right:5px" id="prog_'+i+'">0%</span><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                      f.size, ' bytes, last modified: ',
                      f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                      '</li>');
 
                if (opts.ftp_filename!=0)
                {   //when filename specified
                    var suffix="";
                    var fl = opts.ftp_filename;
 
                    if (i>0) //when multiple files number it linear
                    {
                        suffix = "_" + (1 + i); //(so the first is 2..)
 
                        var dot = fl.lastIndexOf(".");
 
                        if (dot>-1) // filename_suffix.ext
                            fl = fl.substring(0, dot) + suffix + fl.substring(dot);
                        else //when no dot found -> filename_suffix
                            fl = fl + suffix;
 
                    }
 
                    uploadFile(files[i], i, fl, opts.overwrite);
                }
                else  //when no ftp filename specified, use the original
                    uploadFile(files[i], i, f.name, opts.overwrite);
        }
 
        $(drop_list).html('<ul>' + output.join('') + '</ul>');
    } 
 
    $(drop_element).on('dragover', function(e){
        e.stopPropagation();
        e.preventDefault();
 
        $(drop_element).addClass("dropstylehover");
 
        e.dataTransfer.dropEffect = 'move'; 
    });
 
    $(drop_element).on('dragleave', function(e){
        $(drop_element).removeClass("dropstylehover");
    });
 
    // upload file
    function uploadFile(file, array_pos, ftp_filename, overwrite) {
        // jQ ajax internally uses XMLHttpRequest
        // prepare XMLHttpRequest
        var xhr = new XMLHttpRequest();
        xhr.open('POST', "upload.php");
        xhr.setRequestHeader("X-File-Pos", array_pos);
        xhr.setRequestHeader("X-File-Name", ftp_filename);
 
        xhr.onload = function() {
 
                if (this.status == 200) {
                    //filename_uploaded
                    var d = JSON.parse(this.responseText);
 
                    // Fire the setup callback, send back which file is completed
                    $.isFunction( opts.completed ) && opts.completed.call( this, d.filename );
                    //update the file span, depend on position 
                    $("#prog_"+array_pos).html(d.msg);
                }
        };
        xhr.onerror = function() {
            var d = JSON.parse(this.responseText);
            $("#prog_"+array_pos).html(d.msg);
 
            // Fire the setup callback, when error occurs
            $.isFunction( opts.error ) && opts.error.call( this );
        };
        xhr.upload.onprogress = function(e) {
             if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                $("#prog_"+array_pos).html(parseFloat(percentComplete).toFixed(2) + "%");
                // array_pos = so its available here because of JSclosures
            }
         }
        xhr.upload.onloadstart = function(event) {
        }

        // you dont need to have a form to submit use FormData 
        // prepare FormData
        var formData = new FormData();
        formData.append('myfile', file);
        formData.append('ftp_filename', ftp_filename);
        formData.append('overwrite', overwrite); 
 
        xhr.send(formData);
    }
 
    //plugin defaults
    $.fn.upload.defaults = {
        single : 1,
        overwrite: 0,
        ftp_filename: 0,
        completed : null,
        error : null,
    };
} 
})( jQuery );