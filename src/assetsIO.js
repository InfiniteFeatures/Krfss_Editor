const fs = require("fs");
const path = require("path");
Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};
class assetsIO {
    constructor(filename) {
        this.sizelimit = 114514;
        this.filename = filename;
        this.basename = path.basename(filename);
        this.dirname = path.dirname(filename);
        this.inited = false;
        this.inited = this.read();
        this.imgdir = path.join(
            this.dirname,
            path.parse(this.basename).name + "_img"
        );
        return this.inited;
    }
    nmtgimg_src(index) {
        return path.join(this.imgdir, "nmtg_" + index.pad(4) + ".png");
    }
    textimg_src(index) {
        return path.join(this.imgdir, "text_" + index.pad(4) + ".png");
    }
    read() {
        try {
            // Check Scirpt File
            try {
                var stat = fs.statSync(this.filename);
            } catch (err) {
                throw "Error: No such file " + this.filename;
            }
            if (stat.size > this.sizelimit) {
                throw "Error: " +
                    this.filename +
                    "'s\nsize " +
                    stat.size +
                    " is over the limit " +
                    this.sizelimit;
            }
            this.size = stat.size;
            this.rawdata = fs.readFileSync(this.filename);
            // Parse json into data
            this.data = JSON.parse(this.rawdata);
            if (
                this.data.video &&
                this.data.nmtgs &&
                this.data.trans &&
                this.data.nmtg_map &&
                this.data.timestamp
            ) {
                return true;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
        return false;
    }
    write() {
        const content_json = JSON.stringify(this.data, null, 2);
        const content_json_r = content_json
            .replace("\n", "\r\n")
            .replace("\r\r", "\r");
        try {
            fs.writeFileSync(this.filename, content_json_r, "utf8");
        } catch (e) {
            throw e;
            return;
        }
    }
}

module.exports = assetsIO;
