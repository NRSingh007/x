const moment = require('moment');
const BannerImageModel = require('../../models/banner_image');
const BannerTextModel = require('../../models/banner_text');


exports.get_banner_images = (req, res) => {
    BannerImageModel.find()
        .sort({ _id: -1 })
        .then(bannerImages => {
            console.log('path: /admin/banner/image');
            res.render('./layout/admin/banner_image', {
                pageTitle: 'banner image',
                bannerImages: bannerImages,
                moment: moment
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/auth/login?via=admin');
        });
}

exports.post_add_banner_image = (req, res) => {
    const banner_image_title = req.body.banner_image_title;

    if (banner_image_title == '') {
        return res.redirect('/admin/banner/image');
    }
    if (!req.files['banner_image']) {
        return res.redirect('/admin/banner/image');
    }

    let image_filename = req.files['banner_image'][0].filename;
    console.log(req.files['banner_image'][0]);

    const bannerImage = new BannerImageModel({
        image_title: banner_image_title,
        filename: image_filename,
        file_id: req.files['banner_image'][0].id
    })
    bannerImage.save()
        .then(result => {
            // console.log(result);
            return res.redirect('/admin/banner/image');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.post_set_banner_active = (req, res) => {
    const bannerId = req.params.bannerId.trim();
    BannerImageModel.find()
        .then(banners => {
            // Reset Active banner
            banners.forEach((banner, i) => {
                if (banner.status == true) {
                    banner.status = false;
                    banner.save()
                        .then(result => {
                            console.log('Active reset');
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }
            })

            // Set new active banner
            BannerImageModel.findById(bannerId)
                .then(result2 => {
                    result2.status = true;
                    result2.save()
                        .then(result3 => {
                            console.log('New active set success!')
                            return res.redirect('/admin/banner/image');
                        })
                        .catch(err3 => console.log(err3));
                })
                .catch(err2 => console.log(err2))
        })
        .catch(err => console.log(err))
}

exports.post_set_banner_inactive = (req, res) => {
    const bannerId = req.params.bannerId.trim();
    // Set new active banner
    BannerImageModel.findById(bannerId)
        .then(result => {
            result.status = false;
            result.save()
                .then(result2 => {
                    console.log('Active banner set to inactive!')
                    return res.redirect('/admin/banner/image');
                })
                .catch(err3 => console.log(err3));
        })
        .catch(err2 => console.log(err2))
}


// ******** Banner text section *********
exports.get_banner_text = (req, res) => {
    BannerTextModel.find()
        .sort({ _id: -1 })
        .then(bannerTexts => {
            console.log('path: /admin/banner/text');
            res.render('./layout/admin/banner_text', {
                pageTitle: 'banner text',
                bannerTexts: bannerTexts,
                moment: moment
            })
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            res.redirect('/auth/login?via=admin');
        });
}

exports.post_banner_add_text = (req, res) => {
    const banner_text = req.body.banner_text;
    if (banner_text == '') {
        return res.redirect('/admin/banner/text');
    }
    const bannerText = new BannerTextModel({
        banner_text: banner_text
    })

    bannerText.save()
        .then(result => {
            console.log(result);
            return res.redirect('/admin/banner/text');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.post_set_banner_text_active = (req, res) => {
    const text_id = req.body.text_id.trim();
    BannerTextModel.findById(text_id)
        .then(text => {
            text.status = true;
            text.save()
                .then(res1 => {
                    BannerTextModel.find()
                        .then(texts => {
                            if (texts.length > 0) {
                                texts.forEach((txt, ind) => {
                                    if (txt._id != text_id && txt.status == true) {
                                        txt.status = false;
                                        txt.save()
                                            .then(res2 => {
                                                return res.redirect('/admin/banner/text');
                                            })
                                            .catch(err3 => console.log(err3))
                                    } else {
                                        return res.redirect('/admin/banner/text');
                                    }
                                })
                            } else {
                                return res.redirect('/admin/banner/text');
                            }
                        })
                        .catch(err2 => console.log(err2))
                })
                .catch(err1 => console.log(err1))
        })
        .catch(err => { console.log(err) })
}

exports.post_delete_banner_text = (req, res) => {
    const text_id = req.body.text_id.trim();
    BannerTextModel.deleteOne({ _id: text_id })
        .then(result => {
            console.log('Banner text deleted!');
            return res.redirect('/admin/banner/text');
        })
        .catch(err => console.log(err))
}