!function($) {
	$.fn.extend({
		imgUploader: function(data, options) {
			data = data || [];
			var $this = this;

			if ($this.hasClass('img-upload-container')) {
				if (typeof data == 'string') {
					switch (data) {
						case 'getData':
							return $this.data('imgs');
						case 'destroy':
							$this.removeClass('img-upload-container');
							$this.empty();
							return;
						case 'rebuild':
							$this.imgUploader('destroy');
							$this.imgUploader([], options);
					}
				}
			} else {
				$this.addClass('img-upload-container');

				$this.data('imgs', '');

				options = options || {};
				$this.options = {
					width: Number(options.width)>0 && options.width || 75,
					height: Number(options.height)>0 && options.height || 75,
					previewText: options.previewText || "点击查看",
					removeText: options.removeText || "点击删除",
					removeConfirmText: options.removeConfirmText || "确定删除吗？",
					serverErrorText: options.serverErrorText || "服务器端错误",
					useServerRemove: options.useServerRemove === true || false,
					serverRemoveUrl: options.serverRemoveUrl || '',
					uploadScript: options.uploadScript || 'upload.php',
					uploadPath: options.uploadPath || 'uploads',
					currentPath: options.currentPath || '',
					loadingImg: options.loadingImg || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
					loadingWidth: options.loadingWidth || 24,
					loadingHeight: options.loadingHeight || 24,
					uuidApi: options.uuidApi || '',
					supportMulti: options.supportMulti || false,
					imgUrlPrefix: options.imgUrlPrefix || '',
					maxLimit: options.maxLimit || 0
				};
				$this.data('options', JSON.stringify($this.options));

				function add(imgUrl, imgOrgUrl) {
					$this.append('<li style="width:'+$this.options.width+'px;height:'+$this.options.height+'"><img style="width:'+$this.options.width+'px;height:'+$this.options.height+'px" title="'+$this.options.previewText+'" src="' + imgUrl + '"'+(imgOrgUrl?' data-org="'+imgOrgUrl+'"':'')+'></li>');
					var $uuid = $this.children('li:last');
					$uuid.append('<font title="'+$this.options.removeText+'">&times;</font>');
					$('>img', $uuid).bind('click', function(){
						window.open(imgOrgUrl?imgOrgUrl:imgUrl);
					});
					$('>font', $uuid).bind('click', function(){
						imgUploader.remove($uuid.parent(), $uuid);
					});
					$uuid.hover(function(){
						$(this).children('font').show();
					},function(){
						$(this).children('font').hide();
					});
					var d = $this.data('imgs'),d = d && d.split(',')||[];
					d.push(imgUrl);
					$this.data('imgs', d.join(','));
				}

				if (data instanceof Array && data.length > 0) {
					for (var i in data) {
						add(data[i]);
					}
				}

				$this.each(function() {
					imgUploader.create($(this));
				});
			}
		}
	});

	window.imgUploader = {
		preupload: function(uuid) {
			var $uuid = $('#'+uuid);
			$('>iframe', $uuid).hide();
			var pops = JSON.parse($uuid.parent().data('options'));
			$uuid.append('<span style="position:relative;width:'+pops.width+'px;height:'+pops.height+'px;display:inline-block;"><img style="width:'+pops.loadingWidth+'px;height:'+pops.loadingHeight+'px;position:absolute;top:'+Math.floor((pops.height-pops.loadingHeight)/2)+'px;left:'+Math.floor((pops.width-pops.loadingWidth)/2)+'px" src="'+pops.loadingImg+'"></span>');
		},
		afterupload: function(uuid, exts) {
			var prt = $('#'+uuid).parent();
			var pops = JSON.parse(prt.data('options'));
			var len = exts.length;
			var arr = [];
			var d = prt.data('imgs') && prt.data('imgs').split(',') || [];
			for (var i = 0; i<len; i++) {
				if (pops.maxLimit != 0 && pops.maxLimit == d.length+i) {
					break;
				}
				if (len > 1) {
					if (i == 0) {
						$('#'+uuid).attr('id', uuid+'-'+i);
					} else {
						$('#'+uuid+'-0').clone().attr('id', uuid+'-'+i).insertAfter($('#'+uuid+'-'+(i-1)));
					}
					arr.push(uuid+'-'+i);
				} else {
					arr.push(uuid);
				}
			}

			for (var ii in arr) {
				var uuid = arr[ii];
				var ext = exts[ii];
				(function(uuid,ext,len){
					var imgUrl = pops.imgUrlPrefix+pops.uploadPath+'/' + uuid + '.' + ext;
					var $uuid = $('#'+uuid);
					$('body').append('<img id="bd-'+uuid+'" style="display:none" src="'+imgUrl+'">');
					$('#bd-'+uuid).one('load error abort', function(){
						$uuid.html('<img style="width:'+pops.width+'px;height:'+pops.height+'px" title="'+pops.previewText+'" src="' + imgUrl + '">');
						$uuid.append('<font title="'+pops.removeText+'">&times;</font>');
						$('>img', $uuid).bind('click', function(){
							window.open(imgUrl);
						});
						$('>font', $uuid).bind('click', function(){
							imgUploader.remove($uuid.parent(), $uuid);
						});
						$uuid.hover(function(){
							$(this).children('font').show();
						},function(){
							$(this).children('font').hide();
						});

						$(this).remove();

						var d = prt.data('imgs') && prt.data('imgs').split(',') || [];
						d.push(imgUrl);
						var dl = d.length;
						d = d.join(',');
						prt.data('imgs', d);

						//if (ii == len-1 && pops.maxLimit != 0 && pops.maxLimit > dl) {
						imgUploader.create(prt);
						//}
					});
				})(uuid,ext,len);
			}
		},
		exception: function(msg) {
			alert(msg);
		},
		create: function(uploader) {
			var $this = $(uploader);
			var pops = JSON.parse($this.data('options'));
			if ($('.uploader', $this).length > 0 || pops.maxLimit != 0 && pops.maxLimit == $('li', $this).length) return true;
			var uuid = '';
			if (pops.uuidApi != '') {
				$.ajax({
					url: pops.uuidApi,
					async: false,
					type: 'get',
					success: function(r) {
						uuid = 'li-'+r;
					}
				});
			} else {
				uuid = 'li-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
					function(c) {
						var r = Math.random() * 16 | 0,
						v = c == 'x' ? r: r & 0x3 | 0x8;
						return v.toString(16);
					});
			}
			$this.append('<li style="width:'+pops.width+'px;height:'+pops.height+'px" id="' + uuid + '"></li>');
			var obj = $('#' + uuid);
			if (/\sChrome\//ig.test(navigator.userAgent)) {
				var __DIR__ = pops.currentPath;
			if (__DIR__ == '') {
				var __FILE__ = '';
				var stack=((new Error).stack).split("\n");

				if(stack[0]=="Error") { // Chromium
					var m;
					if(m=stack[2].match(/\((.*):[0-9]+:[0-9]+\)/))
						__FILE__ = m[1];
				} else { // Firefox, Opera
					__FILE__ = stack[1].split("@")[1].split(":").slice(0,-1).join(":");
				}

				__DIR__ = __FILE__.substr(0, __FILE__.lastIndexOf('/'));
			}
			obj.append('<iframe style="width:'+pops.width+'px;height:'+pops.height+'px" class="uploader" src="'+__DIR__+'/img-uploader-frame.html?uuid=' + uuid + '&width='+pops.width+'&height='+pops.height+'&supportMulti='+pops.supportMulti+'&uploadScript='+encodeURIComponent(pops.uploadScript)+'"></iframe>');
			return true;
			}
			obj.append('<iframe style="width:'+pops.width+'px;height:'+pops.height+'px" class="uploader"></iframe>');
			var frame_html = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{padding:0;margin:0;overflow:hidden;background:#EEE;text-align:center;color:#AAA}#img{position:absolute;top:0;right:0;font-size:'+pops.width+'px;opacity:0;filter:alpha(opacity=0);direction:ltr}font{font-size:'+pops.width+'px;line-height:'+pops.height+'px;font-family:Arial}form{margin:0;padding:0}</style></head><body><font>+</font><form action="'+pops.uploadScript+'" method="post" enctype="multipart/form-data"><input name="uuid" value="' + uuid + '" type="hidden"><input name="img'+(pops.supportMulti?'[]':'')+'" id="img" type="file"'+(pops.supportMulti?' multiple':'')+' onchange="if (typeof FileReader === "undefined" || this.files[0].size < 1024*1024) {parent.imgUploader.preupload(\'' + uuid + '\');document.getElementsByTagName(\'form\')[0].submit();}"></form></body></html>';
			var uploader = $('#' + uuid + '>.uploader')[0];
			if (/\sFirefox\//ig.test(navigator.userAgent)) {
				setTimeout(function() {
					uploader.contentWindow.document.open();
					uploader.contentWindow.document.write(frame_html);
					uploader.contentWindow.document.close();
				},
				100);
			} else {
				uploader.contentWindow.document.open();
				uploader.contentWindow.document.write(frame_html);
				uploader.contentWindow.document.close();
			}

		},
		remove: function(uploader, obj) {
			var pops = JSON.parse(uploader.data('options'));
			if (confirm(pops.removeConfirmText)) {
				var img = obj.find('img').attr('src');
				if (pops.useServerRemove) {
					$.ajax({
						url: pops.serverRemoveUrl,
						type: 'post',
						data: {img: img},
						dataType: 'text',
						error: function() {
							alert(pops.serverErrorText);
						},
						success: function(res) {
							if (res=='ok') {
								var data = uploader.data('imgs').split(',');
								data.splice(data.indexOf(img),1);
								uploader.data('imgs', data.join(','));
								$(obj, uploader).remove();
								if ($('.uploader', uploader).length == 0) {
									imgUploader.create(uploader);
								}
							} else {
								alert(res);
							}
						}
					});
				} else {
					var data = uploader.data('imgs').split(',');
					data.splice(data.indexOf(img),1);
					uploader.data('imgs', data.join(','));
					$(obj, uploader).remove();
					if ($('.uploader', uploader).length == 0) {
						imgUploader.create(uploader);
					}
				}
			}
		}
	}

} (jQuery);
