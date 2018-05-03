$ = require('jquery');
$(function(){
    const fs = require('fs');
    const path = require('path')
    var textarea = $("#textarea_t"),
        holder = $("#holder"),
        file_indicator = $("#file_indicator"),
        item_container = $("#item_container"),
        saver = $("#saver")
    ;
    var content = null
    var filepath = null
    var nmtg_map_expand = []
    var nmtg_ptr = []
    var tran_ptr = []
    var modified = false
	$(document).on({
		dragleave: function(e) {
            e.preventDefault();
        },
		drop: function(e) {
            e.preventDefault();
        },
		dragenter: function(e) {
            e.preventDefault();
        },
		dragover: function(e) {
            e.preventDefault();
        }
	});
    holder.on({
        dragleave: function(e) {
            e.preventDefault();
            holder.removeClass("holder-ondrag");
            holder.text("Please drag the subtitle file here");
        },
        drop: onDragFile,
        dragenter: function(e) {
            e.preventDefault();
            holder.addClass("holder-ondrag");
            holder.text("Release Mouse to Open File");
        },
        dragover: function(e) {
            e.preventDefault();
            holder.addClass("holder-ondrag");
            holder.text("Release Mouse to Open File");
        },
        click: saveFile     
    });
    function onDragFile(e) {
        e.preventDefault();
        console.log(e.dataTransfer);
        var efile = e.originalEvent.dataTransfer.files[0];
        holder.removeClass("holder-ondrag");
        holder.text("Openning File");
        fs.readFile(efile.path, "utf8", function(err, data){
            if(err) {
                holder.text("Error")
                file_indicator.html(err);
                throw err;
            }
            filepath = efile.path
            try {
                content = JSON.parse(data)
            } catch (err2) {
                holder.text("Error")
                file_indicator.html(err2 + '<br>' +filepath);
                throw err2
            }
            if (! content.trans || ! content.nmtgs || ! content.total || ! content.nmtg_map || ! content.timestamp) {
                holder.text("Error")
                file_indicator.html("Invalid krfss file" + '<br>' + filepath);
                return false;
            }
            holder.text("Opened")
            file_indicator.html("Working on file" + '<br>' + filepath)
            afterOpenFile();
        });    
        return false;
    };
    Number.prototype.pad = function(size) {var s=String(this);while(s.length<(size||2)){s="0"+s;}return s;}
    function afterOpenFile() {
        nmtg_map_expand = []
        nmtg_ptr = []
        tran_ptr = []
        item_container.html('');
        img_dir = path.dirname(filepath) + '/' + content.video + '_img'
        for (var i = 0; i < content.total; ++i) {
            var mapped_nmtg_id = content.nmtg_map[i]
            nmtg_map_expand[i] = []
            for (var j = 0; j < content.total; ++j) {
                if (content.nmtg_map[j] == mapped_nmtg_id && j != i) {
                    nmtg_map_expand[i].push(j)
                }
            }
            var item = $('<div class="item"></div>')
            var nmtg_img = $('<img src="' + img_dir + '/nmtg_' + mapped_nmtg_id.pad(4) + '.png" class="nmtg">').appendTo(item)
            var text_img = $('<img src="' + img_dir + '/text_' + i.pad(4) + '.png" class="text">').appendTo(item)
            var nmtg_input = $('<input type="text" class="nmtg" id="nmtg_' + i + '">')
                .val(content.nmtgs[mapped_nmtg_id])
                .on('change', function(e) {
                    modified = true
                    holder.addClass("saver_modified")
                    holder.html("Modified<br>Click to Save")
                    var i = this.id.substring(5)
                    var mapped_nmtg_id = content.nmtg_map[i]
                    content.nmtgs[mapped_nmtg_id] = this.value
                    for (var j = 0; j < nmtg_map_expand[i].length; ++j) {
                        var mapped_nmtg_jd = nmtg_map_expand[i][j]
                        nmtg_ptr[mapped_nmtg_jd].val(this.value)
                    }
                    console.log("ID: " + i + "\t" + content.nmtgs[mapped_nmtg_id])
                })
                .appendTo(item)
            var tran_input = $('<textarea rows="2" class="tran" id="tran_' + i + '"></textarea></div>')
                .text(content.trans[i])
                .on('change', function(e) {
                    modified = true
                    holder.addClass("saver_modified")
                    holder.html("Modified<br>Click to Save")
                    var i = this.id.substring(5)
                    content.trans[i] = this.value
                    console.log("ID: " + i + "\t" + content.trans[i])
                })
                .appendTo(item)
            
            item.appendTo(item_container)
            nmtg_ptr.push(nmtg_input)
            tran_ptr.push(tran_input)
        }
        console.log(nmtg_map_expand)
    }
    function saveFile() {
        if (!modified || !filepath)
            return
        var content_json = JSON.stringify(content, null, 2)
        var content_json_r = content_json.replace("\n", "\r\n").replace("\r\r", "\r")
        try {
            fs.writeFileSync(filepath, content_json_r, 'utf8');
        } catch (e) {
            file_indicator.html("Can not write to<br>" + filepath + "<br" + e)
            throw e
            return
        }
        file_indicator.html("Writed to" + '<br>' + filepath)
        holder.text("Written")
        modified = false
        holder.removeClass("saver_modified")
    }
});

console.log("A")
//fs.writeFileSync('message.txt', 'A', 'utf8');