# js_php_upload
jQuery Upload Helper 

sponsor_img - is a folder near 'upload.php'

how to:

			$(function ()
				{
		            //general jQ callback onerror (if image doesnt exist) on edit (aka line 36)
		            $("#sponsor_drop_fl_image").error(function() {
		              this.src = 'sponsor_img/404.jpg'; // replace with default image
		            });
            
			        $("#sponsor_drop_fl").upload({
			        	upload_script : 'upload_sponsor.php',
			            single: 1,
			            overwrite : 1,
			            completed : function(e) {
			                $("#sponsor_drop_fl_image").attr("src",e+"?" + new Date().getTime()); //avoid image cache (aka the image doesnt updated)
			            },
			            error : function(){
			                $("#sponsor_drop_fl_image").attr("src","sponsor_img/404.jpg");
			            }
			        });
					
					//when edit
					//thumb
					$("#sponsor_drop_fl_image").attr("src","sponsor_img/" + data.event_sponsor_id + ".jpg");
					$("#sponsor_drop_fl_zone").data("filename", data.event_sponsor_id + ".jpg");
					
					$("#sponsor_image_div").show();	 	
					//thumb
					
					<div class="col-xs-4 col-sm-4 col-lg-4 col-md-4" id="sponsor_image_div" style="display:none;">
						<font style="color:red">Sponsor Image (JPG)</font> <br/>
						
					    <img id="sponsor_drop_fl_image" src="sponsor_img/404.jpg" style="float:right;" width="60px" height="60px">
					 
					    <span class="btn btn-primary btn-file" id="sponsor_drop_fl_zone" data-filename="0.jpg">
					        Browse or Drop an Image file <input type="file" id="sponsor_drop_fl" multiple>
					    </span>
					    <br/>
					    <div id="sponsor_drop_fl_list"></div>
					</div>
					
				    $('#modalEVENT_SPONSORS').on('hidden.bs.modal', function() {
				 		$("#sponsor_image_div").hide();
						$("#sponsor_drop_fl_zone").reset();
				    });
