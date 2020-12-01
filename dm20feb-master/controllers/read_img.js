const fs = require('fs');

exports.read_logo = (req, res) => {
    const img_name = req.params.img;
    fs.readFile(`./public/assets/img/post_mail/${img_name}`, function (err, data) {
        res.writeHead(200, { 'Content-Type': 'image/*' });
        res.end(data);
    });

}