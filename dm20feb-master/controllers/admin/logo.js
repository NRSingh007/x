const { render } = require('ejs');
const LogoImageModel = require('../../models/logo_image');

exports.get_logo_image = (req, res) => {
    console.log('path: /admin/logo')
    LogoImageModel.find()
        .sort({ _id: -1 })
        .then(logos => {
            // console.log(logos);
            return res.render('./layout/admin/logo_image', {
                pageTitle: 'logo image',
                logos: logos
            })
        })
        .catch(err => { console.log(err) })

}

exports.post_logo_image = (req, res) => {
    if (!req.files['logo_image']) {
        return res.redirect('/admin/logo');
    }
    const logoImage = new LogoImageModel({
        filename: req.files['logo_image'][0].filename,
        file_id: req.files['logo_image'][0].id,
        purpose: req.body.logo_purpose
    })

    logoImage.save()
        .then(result => {
            return res.redirect('/admin/logo');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.post_set_logo_active = (req, res) => {
    const logo_purpose = req.body.logo_purpose;
    const logo_id = req.body.logo_id.trim();

    LogoImageModel.find()
        .then(logos => {
            logos.forEach((lg, i) => {
                if (lg._id != logo_id && lg.purpose == logo_purpose) {
                    lg.status = false;
                    lg.save()
                        .then(result => {
                            console.log(`Active ${logo_purpose} logo reset!`);
                        })
                        .catch(err1 => {
                            console.log(err1);
                        })
                }

                LogoImageModel.findById(logo_id)
                    .then(result2 => {
                        result2.status = true;
                        result2.save()
                            .then(result3 => {
                                console.log(`${logo_purpose} logo set active success!`);
                                return res.redirect('/admin/logo');
                            })
                            .catch(err2 => console.log(err2))
                    })
                    .catch(err3 => console.log(err3))
            })
        })
        .catch(err => {
            console.log(err);
        })

}