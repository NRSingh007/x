const PostModel = require('./../../models/post').model;
const StateModel = require('./../../models/state').model;
const DistrictModel = require('./../../models/district').model;
const LocalityModel = require('./../../models/locality').model;
const KeywordModel = require('./../../models/keyword').model;
const CategoryModel = require('./../../models/category').model;
const CollectionModel = require('./../../models/collection').model;
const UserModel = require('./../../models/user').model;
const ReviewModel = require('./../../models/review').model;
const ReportModel = require('./../../models/report').model;
const LogoImageModel = require('./../../models/logo_image');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const sgMail = require("@sendgrid/mail");

// Product model
const Product = require('./../../models/product');


// twilio integration
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID_DEV;
const authToken = process.env.TWILIO_AUTH_TOKEN_DEV;
const twilio_client = new twilio(accountSid, authToken);


//Sendgrid integration
sgMail.setApiKey(process.env.SENDGRID_API_KEY)




function calcRating(ratingsObj) {


    // const rating = Object.values(this.ratings); // bug: includes extra element ' true '
    let total = {
        totalWeight: 0,
        totalVotes: 0
    };

    console.log({ ratingsObj });
    if (!ratingsObj) {
        return [2.5, 0];
    }
    const ratings = { ...JSON.parse(JSON.stringify(ratingsObj)) };
    for (let key in ratings) {
        // console.log({ 'votes': ratings[key].votes, 'weight': ratings[key].weight});
        if (ratings[key] && ratings[key].weight) {
            total['totalWeight'] += ratings[key].weight * ratings[key].votes;
            total['totalVotes'] += ratings[key].votes;
        }

    }
    const calcRating = total['totalWeight'] / total['totalVotes'];

    console.log({ calcRating: calcRating ? calcRating.toFixed(1) : 2.5, totalVotes: total['totalVotes'] });
    let clean = calcRating ? calcRating.toFixed(1) : null;
    const star = [1, 2, 3, 4, 5];
    const found = star.find(i => i == clean);
    if (found) {
        return [parseInt(clean), total['totalVotes']];
    }
    return [calcRating ? calcRating.toFixed(1) : 2.5, total['totalVotes']];

}

exports.findKeywordsAndSubcategory = async (categoryId) => {

    try {
        const Category = await CategoryModel.findOne({
            _id: categoryId
        }, {
            id: 1,
            name: 1,
            subCategory: 1,
            keywords: 1
        }).populate('subCategory').sort({
            name: 1
        })
        console.log({
            Category
        });
        return {
            result: Category
        };

    } catch (error) {
        return {
            error
        };
    }

}

exports.addPost = (postData, user) => {


    console.log('%c Final data', postData);
    console.log('User ID:', user._id);
    console.log('User Name:', user.name.fullName);
    const saved = new PostModel(postData);
    saved.save()
        .then(savedResult => {
            console.log('saved: ', savedResult);
            console.log(postData);
            let company_logo = '';
            let facebook_logo = '';
            let instagram_logo = '';
            let twitter_logo = '';
            let pinterest_logo = '';

            LogoImageModel.find()
                .then(logos => {
                    if (logos.length > 0) {
                        logos.forEach((logo, index) => {
                            if (logo.purpose == 'company' && logo.status == true) {
                                company_logo = logo.filename;
                            }
                            if (logo.purpose == 'facebook' && logo.status == true) {
                                facebook_logo = logo.filename;
                            }
                            if (logo.purpose == 'instagram' && logo.status == true) {
                                instagram_logo = logo.filename;
                            }
                            if (logo.purpose == 'twitter' && logo.status == true) {
                                twitter_logo = logo.filename;
                            }
                            if (logo.purpose == 'pinterest' && logo.status == true) {
                                pinterest_logo = logo.filename;
                            }
                        })
                    }

                    const msg = {
                        to: user.email,
                        from: process.env.SUPPORT_EMAIL,
                        subject: 'Successfully added your post!',
                        html: `<!DOCTYPE html
                    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office"
                    xmlns:v="urn:schemas-microsoft-com:vml">
                
                <head>
                    <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <meta content="width=device-width" name="viewport" />
                    <!--[if !mso]><!-->
                    <meta content="IE=edge" http-equiv="X-UA-Compatible" />
                    <!--<![endif]-->
                    <title></title>
                    <!--[if !mso]><!-->
                    <link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css" />
                    <!--<![endif]-->
                    <style type="text/css">
                        body {
                            margin: 0;
                            padding: 0;
                        }
                
                        table,
                        td,
                        tr {
                            vertical-align: top;
                            border-collapse: collapse;
                        }
                
                        * {
                            line-height: inherit;
                        }
                
                        a[x-apple-data-detectors=true] {
                            color: inherit !important;
                            text-decoration: none !important;
                        }
                    </style>
                    <style id="media-query" type="text/css">
                        @media (max-width: 670px) {
                
                            .block-grid,
                            .col {
                                min-width: 320px !important;
                                max-width: 100% !important;
                                display: block !important;
                            }
                
                            .block-grid {
                                width: 100% !important;
                            }
                
                            .col {
                                width: 100% !important;
                            }
                
                            .col>div {
                                margin: 0 auto;
                            }
                
                            img.fullwidth,
                            img.fullwidthOnMobile {
                                max-width: 100% !important;
                            }
                
                            .no-stack .col {
                                min-width: 0 !important;
                                display: table-cell !important;
                            }
                
                            .no-stack.two-up .col {
                                width: 50% !important;
                            }
                
                            .no-stack .col.num4 {
                                width: 33% !important;
                            }
                
                            .no-stack .col.num8 {
                                width: 66% !important;
                            }
                
                            .no-stack .col.num4 {
                                width: 33% !important;
                            }
                
                            .no-stack .col.num3 {
                                width: 25% !important;
                            }
                
                            .no-stack .col.num6 {
                                width: 50% !important;
                            }
                
                            .no-stack .col.num9 {
                                width: 75% !important;
                            }
                
                            .video-block {
                                max-width: none !important;
                            }
                
                            .mobile_hide {
                                min-height: 0px;
                                max-height: 0px;
                                max-width: 0px;
                                display: none;
                                overflow: hidden;
                                font-size: 0px;
                            }
                
                            .desktop_hide {
                                display: block !important;
                                max-height: none !important;
                            }
                        }
                    </style>
                </head>
                
                <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #F5F5F5;">
                    <!--[if IE]><div class="ie-browser"><![endif]-->
                    <table bgcolor="#F5F5F5" cellpadding="0" cellspacing="0" class="nl-container" role="presentation"
                        style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; width: 100%;"
                        valign="top" width="100%">
                        <tbody>
                            <tr style="vertical-align: top;" valign="top">
                                <td style="word-break: break-word; vertical-align: top;" valign="top">
                                    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#F5F5F5"><![endif]-->
                                    <div style="background-color:transparent;">
                                        <div class="block-grid"
                                            style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                            <div
                                                style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
                                                <div class="col num12"
                                                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                                    <div style="width:100% !important;">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div
                                                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                            <!--<![endif]-->
                                                            <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                                role="presentation"
                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td class="divider_inner"
                                                                            style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                            valign="top">
                                                                            <table align="center" border="0" cellpadding="0"
                                                                                cellspacing="0" class="divider_content" height="10"
                                                                                role="presentation"
                                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 10px; width: 100%;"
                                                                                valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top;" valign="top">
                                                                                        <td height="10"
                                                                                            style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                            valign="top"><span></span></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color:transparent;">
                                        <div class="block-grid two-up no-stack"
                                            style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="325" style="background-color:#FFFFFF;width:325px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 25px; padding-top:25px; padding-bottom:25px;"><![endif]-->
                                                <div class="col num6"
                                                    style="min-width: 320px; max-width: 325px; display: table-cell; vertical-align: top; width: 325px;">
                                                    <div style="width:100% !important;">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div
                                                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:25px; padding-bottom:25px; padding-right: 0px; padding-left: 25px;">
                                                            <!--<![endif]-->
                                                            <div align="left" class="img-container left fullwidthOnMobile fixedwidth"
                                                                style="padding-right: 0px;padding-left: 0px;">
                                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="left"><![endif]-->
                                                                <div style="font-size:1px;line-height:5px"> </div><img alt="Image"
                                                                    border="0" class="left fullwidthOnMobile fixedwidth"
                                                                    src="https://www.digitalmanipur.com/logo/image/${company_logo}"
                                                                    style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 195px; display: block;"
                                                                    title="Image" width="195" />
                                                                <!--[if mso]></td></tr></table><![endif]-->
                                                            </div>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td><td align="center" width="325" style="background-color:#FFFFFF;width:325px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 25px; padding-left: 0px; padding-top:25px; padding-bottom:25px;"><![endif]-->
                                                <div class="col num6"
                                                    style="min-width: 320px; max-width: 325px; display: table-cell; vertical-align: top; width: 325px;">
                                                    <div style="width:100% !important;">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div
                                                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:25px; padding-bottom:25px; padding-right: 25px; padding-left: 0px;">
                                                            <!--<![endif]-->
                                                            <div align="right" class="button-container"
                                                                style="padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:10px;">
                                                                <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 0px; padding-bottom: 10px; padding-left: 10px" align="right"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:28.5pt; width:98.25pt; v-text-anchor:middle;" arcsize="37%" stroke="false" fillcolor="#D4E9F9"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#052d3d; font-family:Tahoma, Verdana, sans-serif; font-size:14px"><![endif]--><a
                                                                    href="${process.env.DOMAIN}/users/home"
                                                                    style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #052d3d; background-color: #D4E9F9; border-radius: 14px; -webkit-border-radius: 14px; -moz-border-radius: 14px; width: auto; width: auto; border-top: 1px solid #D4E9F9; border-right: 1px solid #D4E9F9; border-bottom: 1px solid #D4E9F9; border-left: 1px solid #D4E9F9; padding-top: 3px; padding-bottom: 3px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
                                                                    target="_blank"><span
                                                                        style="padding-left:15px;padding-right:15px;font-size:14px;display:inline-block;"><span
                                                                            style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span
                                                                                data-mce-style="font-size: 14px; line-height: 28px;"
                                                                                style="font-size: 14px; line-height: 28px;">My
                                                                                account</span></span></span></a>
                                                                <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
                                                            </div>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color:transparent;">
                                        <div class="block-grid"
                                            style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #D6E7F0;">
                                            <div
                                                style="border-collapse: collapse;display: table;width: 100%;background-color:#D6E7F0;background-image:url('images/bg_cart_2.png');background-position:top center;background-repeat:no-repeat">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#D6E7F0"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#D6E7F0;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:55px; padding-bottom:60px;"><![endif]-->
                                                <div class="col num12"
                                                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                                    <div style="width:100% !important;">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div
                                                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">
                                                            <!--<![endif]-->
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 15px; padding-top: 20px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                            <div
                                                                style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:5px;padding-left:15px;">
                                                                <div
                                                                    style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
                                                                    <p
                                                                        style="font-size: 38px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 46px; margin: 0;">
                                                                        <span style="font-size: 38px;"><strong><span
                                                                                    style="font-size: 38px;">Post <span
                                                                                        style="font-size: 38px; color: #fc7318;">Ads</span></span></strong></span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                            <div
                                                                style="color:#052D3D;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                                <div
                                                                    style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052D3D; mso-line-height-alt: 14px;">
                                                                    <p
                                                                        style="font-size: 22px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 26px; margin: 0;">
                                                                        <span style="font-size: 22px;"><strong><span
                                                                                    style="font-size: 22px;">You left a few things in
                                                                                    your cart :(</span></strong></span></p>
                                                                </div>
                                                            </div>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                
                
                
                
                                    <div style="background-color:transparent;">
                                        <div class="block-grid"
                                            style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:20px;"><![endif]-->
                                                <div class="col num12"
                                                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                                    <div style="width:100% !important;">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div
                                                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
                                                            <!--<![endif]-->
                                                            <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                                role="presentation"
                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td class="divider_inner"
                                                                            style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                            valign="top">
                                                                            <table align="center" border="0" cellpadding="0"
                                                                                cellspacing="0" class="divider_content" height="0"
                                                                                role="presentation"
                                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                                valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top;" valign="top">
                                                                                        <td height="0"
                                                                                            style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                            valign="top"><span></span></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <table style="" border="0" cellpadding="0" cellspacing="0" align="center"
                                                                width="640" bgcolor="#FFFFFF">
                                                                <tbody>
                                                                    <tr>
                                                                        <td colspan="4" style="padding:30px 20px 10px;font-size:14px">
                                                                            <div style="font-weight:bold">Dear ,${user.name.fullName}</div>
                                                                            <br>
                                                                            <div>Thanks for your Posting.</div>
                                                                            <br>
                                                                            <div
                                                                                style="font-size:16px;font-weight:bold;text-align:center;line-height:30px">
                                                                                <span
                                                                                    style="border-bottom:1px solid #ddd;padding-bottom:5px">Post
                                                                                    Ads Details</span>
                                                                            </div>
                                                                            <br>
                                                                            <div>
                                                                                <table width="100%" cellspacing="0" cellpadding="0"
                                                                                    border="0">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td width="35%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;border-top:5px solid #ddd;padding:7px 10px">
                                                                                                Name:</td>
                                                                                            <td width="65%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;border-top:5px solid #999;padding:7px 10px">
                                                                                                <strong>${saved.ownerDetails.name}</strong></td>
                                                                                        </tr>
                
                                                                                        <tr>
                                                                                            <td width="35%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                Company Name:</td>
                                                                                            <td width="65%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                <strong>${saved.name}</strong>
                                                                                            </td>
                                                                                        </tr>
                
                                                                                        <tr>
                                                                                            <td width="35%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                Address:</td>
                                                                                            <td width="65%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                <strong>
                                                                                                ${saved.address.areaAndStreetAddress}, ${saved.address.locality.name}, ${saved.address.district.name}, ${saved.address.state.name}, ${saved.address.pincode}
                                                                                                </strong>
                                                                                            </td>
                                                                                        </tr>
                
                                                                        
                
                                                                                        <tr>
                                                                                            <td width="35%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                Mobile no:</td>
                                                                                            <td width="65%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                <strong>${saved.mobileNumber[0].number}</strong>
                                                                                            </td>
                                                                                        </tr>
                
                                                                                        <tr>
                                                                                            <td width="35%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                Landline:</td>
                                                                                            <td width="65%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                <strong>${saved.telephoneNumber[0].number}</strong>
                                                                                            </td>
                                                                                        </tr>
                
                                                                                        <tr>
                                                                                            <td width="35%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                Email:</td>
                                                                                            <td width="65%" align="left" valign="top"
                                                                                                style="border-bottom:1px solid #ddd;padding:7px 10px">
                                                                                                <strong>${saved.email}</strong>
                                                                                            </td>
                                                                                        </tr>
                
                
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td colspan="4" style="padding:20px;font-size:14px">
                                                                            <div style="font-size:14px"> <span>Regards,</span> </div>
                                                                            <div style="font-size:14px;padding-top:10px"> <span>Digital
                                                                                    Manipur.</span> </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color:transparent;">
                                        <div class="block-grid"
                                            style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #F0F0F0;">
                                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#F0F0F0;">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#F0F0F0"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#F0F0F0;width:650px; border-top: none; border-left: none; border-bottom: none; border-right: none;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:18px'>&nbsp;</td></tr><tr><td style='padding-top:15px;padding-bottom:15px' width='25' bgcolor='#FFFFFF'><table role='presentation' width='25' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td><td style="padding-right: 35px; padding-left: 35px; padding-top:15px; padding-bottom:5px;"><![endif]-->
                                                <div class="col num12"
                                                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 600px;">
                                                    <div style="width:100% !important;">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div
                                                            style="border-top:18px solid #FFFFFF; border-left:25px solid #FFFFFF; border-bottom:18px solid #FFFFFF; border-right:25px solid #FFFFFF; padding-top:15px; padding-bottom:5px; padding-right: 35px; padding-left: 35px;">
                                                            <!--<![endif]-->
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top: 15px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                            <div
                                                                style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:10px;padding-left:15px;">
                                                                <div
                                                                    style="line-height: 1.2; font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
                                                                    <p
                                                                        style="line-height: 1.2; font-size: 34px; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 41px; margin: 0;">
                                                                        <span style="font-size: 34px;"><span
                                                                                style="color: #fc7318; font-size: 34px;"><strong><span
                                                                                        style="font-size: 34px;">Troubles? <br /></span></strong></span><span
                                                                                style="font-size: 34px;">We're here to help
                                                                                you</span></span></p>
                                                                </div>
                                                            </div>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 30px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                            <div
                                                                style="color:#787878;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:0px;padding-right:10px;padding-bottom:30px;padding-left:10px;">
                                                                <div
                                                                    style="font-size: 12px; line-height: 1.5; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #787878; mso-line-height-alt: 18px;">
                                                                    <p
                                                                        style="font-size: 18px; line-height: 1.5; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 27px; margin: 0;">
                                                                        <span style="font-size: 18px;">Grow your business online.Grow
                                                                            your business with Digital Manipur. <strong><a href="#"
                                                                                    rel="noopener"
                                                                                    style="text-decoration: none; color: #2190E3;"
                                                                                    target="_blank">digitalmanipurinfo@gmail.com.com</a></strong></span><br /><span
                                                                            style="font-size: 18px;">or call us at <span
                                                                                style="color: #2190e3; font-size: 18px;">(<strong>389</strong>)</span>
                                                                            <span
                                                                                style="color: #2190e3; font-size: 18px;"><strong>839289328932</strong></span>
                                                                            <br /><strong>Monday through Friday 8:30-5:30
                                                                                PST</strong></span></p>
                                                                </div>
                                                            </div>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td><td style='padding-top:15px;padding-bottom:15px' width='25' bgcolor='#FFFFFF'><table role='presentation' width='25' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td></tr><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:18px'>&nbsp;</td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color:transparent;">
                                        <div class="block-grid"
                                            style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                                            <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
                                                <div class="col num12"
                                                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                                    <div style="width:100% !important;">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div
                                                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                                                            <!--<![endif]-->
                                                            <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                                role="presentation"
                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td class="divider_inner"
                                                                            style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                            valign="top">
                                                                            <table align="center" border="0" cellpadding="0"
                                                                                cellspacing="0" class="divider_content" height="0"
                                                                                role="presentation"
                                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;"
                                                                                valign="top" width="100%">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top;" valign="top">
                                                                                        <td height="0"
                                                                                            style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                            valign="top"><span></span></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <div style="background-color:transparent;">
                                        <div class="block-grid"
                                            style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                                            <div
                                                style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                                                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                                                <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:20px; padding-bottom:60px;"><![endif]-->
                                                <div class="col num12"
                                                    style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                                                    <div style="width:100% !important;">
                                                        <!--[if (!mso)&(!IE)]><!-->
                                                        <div
                                                            style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:20px; padding-bottom:60px; padding-right: 0px; padding-left: 0px;">
                                                            <!--<![endif]-->
                                                            <table cellpadding="0" cellspacing="0" class="social_icons"
                                                                role="presentation"
                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td style="word-break: break-word; vertical-align: top; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                            valign="top">
                                                                            <table align="center" cellpadding="0" cellspacing="0"
                                                                                class="social_table" role="presentation"
                                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;"
                                                                                valign="top">
                                                                                <tbody>
                                                                                    <tr align="center"
                                                                                        style="vertical-align: top; display: inline-block; text-align: center;"
                                                                                        valign="top">
                                                                                        <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;"
                                                                                            valign="top"><a
                                                                                                href="https://www.facebook.com/"
                                                                                                target="_blank"><img alt="Facebook"
                                                                                                    height="32"
                                                                                                    src="https://www.digitalmanipur.com/logo/image/${facebook_logo}"
                                                                                                    style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                                                                    title="Facebook" width="32" /></a>
                                                                                        </td>
                                                                                        <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;"
                                                                                            valign="top"><a href="https://twitter.com/"
                                                                                                target="_blank"><img alt="Twitter"
                                                                                                    height="32"
                                                                                                    src="https://www.digitalmanipur.com/logo/image/${twitter_logo}"
                                                                                                    style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                                                                    title="Twitter" width="32" /></a>
                                                                                        </td>
                                                                                        <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;"
                                                                                            valign="top"><a
                                                                                                href="https://instagram.com/"
                                                                                                target="_blank"><img alt="Instagram"
                                                                                                    height="32"
                                                                                                    src="https://www.digitalmanipur.com/logo/image/${instagram_logo}"
                                                                                                    style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                                                                    title="Instagram" width="32" /></a>
                                                                                        </td>
                                                                                        <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;"
                                                                                            valign="top"><a
                                                                                                href="https://www.pinterest.com/"
                                                                                                target="_blank"><img alt="Pinterest"
                                                                                                    height="32"
                                                                                                    src="https://www.digitalmanipur.com/logo/image/${pinterest_logo}"
                                                                                                    style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                                                                    title="Pinterest" width="32" /></a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                            <div
                                                                style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                                <div
                                                                    style="font-size: 12px; line-height: 1.5; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 18px;">
                                                                    <p
                                                                        style="font-size: 14px; line-height: 1.5; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">
                                                                        Digital Manipur - The Largest Local Search Engine </p>
                                                                    <p
                                                                        style="font-size: 14px; line-height: 1.5; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">
                                                                        Leibak Information Technology Pvt Ltd. </p>
                                                                    <p
                                                                        style="font-size: 14px; line-height: 1.5; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">
                                                                        Khurai Thoidingjam Leikai, Imphal East, Manipur, India. </p>
                                                                </div>
                                                            </div>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                            <table border="0" cellpadding="0" cellspacing="0" class="divider"
                                                                role="presentation"
                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                valign="top" width="100%">
                                                                <tbody>
                                                                    <tr style="vertical-align: top;" valign="top">
                                                                        <td class="divider_inner"
                                                                            style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;"
                                                                            valign="top">
                                                                            <table align="center" border="0" cellpadding="0"
                                                                                cellspacing="0" class="divider_content" height="0"
                                                                                role="presentation"
                                                                                style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px dotted #C4C4C4; height: 0px; width: 60%;"
                                                                                valign="top" width="60%">
                                                                                <tbody>
                                                                                    <tr style="vertical-align: top;" valign="top">
                                                                                        <td height="0"
                                                                                            style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;"
                                                                                            valign="top"><span></span></td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                            <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                                                            <div
                                                                style="color:#4F4F4F;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                                                                <div
                                                                    style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #4F4F4F; mso-line-height-alt: 14px;">
                                                                    <p
                                                                        style="font-size: 14px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">
                                                                        <span style="font-size: 14px;"><a href="#" rel="noopener"
                                                                                style="text-decoration: none; color: #2190E3;"
                                                                                target="_blank"><strong>Help&amp; FAQ's</strong></a> | 
                                                                            <strong><a href="#" rel="noopener"
                                                                                    style="text-decoration: none; color: #2190E3;"
                                                                                    target="_blank">Returns</a> </strong> |  <span
                                                                                style="background-color: transparent; font-size: 14px;">1-998-9283-19832</span></span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <!--[if mso]></td></tr></table><![endif]-->
                                                            <!--[if (!mso)&(!IE)]><!-->
                                                        </div>
                                                        <!--<![endif]-->
                                                    </div>
                                                </div>
                                                <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                                <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
                                            </div>
                                        </div>
                                    </div>
                                    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <!--[if (IE)]></div><![endif]-->
                </body>
                
                </html>
                `
                    }
                    const msg2 = {
                        to: 'helljohn12@gmail.com',
                        from: process.env.SUPPORT_EMAIL,
                        subject: 'New Post Added!',
                        html: `<p>${user.name.fullName} uploaded a post.</p>`
                    }
                    sgMail.send(msg)
                        .then((err, sgm1) => {
                            console.log(sgm1);
                            sgMail.send(msg2)
                                .then((err2, sgm2) => {
                                    console.log("Post Mail Sent")
                                })
                                .catch(mailerr2 => {
                                    console.log(mailerr2);
                                })

                        })
                        .catch(mailerr => {
                            console.log(mailerr);
                        })

                })
                .catch(logoerr => console.log(logoerr))
        })
        .catch(error => {
            console.log('Error occurred. Please try again.');
            console.log(error);
        })

    return {
        result: postData,
        message: 'Post added'
    };

}

exports.changeBookmark = async (postId, userId, url) => {
    console.log("controller - addBookmark");
    try {
        const [post, user] = await Promise.all([PostModel.findOne({
            _id: postId
        }), UserModel.findOne({
            _id: userId
        })]);
        // console.log({post,user});

        if (post && user) {

            // remove duplicates
            if (user.bookmarks && user.bookmarks.length > 0) {

                console.log('Prev user bookmarks : ', user.bookmarks.length);
                user.bookmarks.forEach(i => {
                    console.log(i.id);
                });

                let uniqueObject = {},
                    newArray = [];
                for (let i in user.bookmarks) {

                    // Extract the title
                    objTitle = user.bookmarks[i]['id'];

                    // Use the title as the index
                    uniqueObject[objTitle] = user.bookmarks[i];
                }

                // Loop to push unique object into array
                for (i in uniqueObject) {
                    newArray.push(uniqueObject[i]);
                }

                console.log("Unique");
                newArray.forEach(i => {
                    console.log(i.id);
                });

                // check if exist
                if (newArray.some(e => String(e.id) == String(postId))) {
                    // exists then remove
                    console.log('Removing');
                    user.bookmarks = newArray.filter(bookmark => String(bookmark.id) != String(postId));
                } else {
                    // insert
                    console.log('Inserting');

                    user.bookmarks = [...newArray, {
                        id: postId,
                        addedDate: Date.now(),
                        url: url
                    }];
                }
            } else {
                user['bookmarks'] = [{
                    id: postId,
                    addedDate: Date.now(),
                    url: url

                }];
            }


            console.log('Current user bookmarks : ', user.bookmarks.length);
            user.bookmarks.forEach(i => {
                console.log(i.id);
            });

            const saved = await user.save();
            console.log('saved');
            return saved.bookmarks;

        } else {
            return new Error('No user/post matched');
        }


    } catch (error) {
        return error;
    }
}

exports.changeBeenThere = async (postId, userId, url) => {
    console.log("controller - changeBeenThere");
    try {
        const [post, user] = await Promise.all([PostModel.findOne({
            _id: postId
        }), UserModel.findOne({
            _id: userId
        })]);
        console.log({ "post id:": post._id, "user id": user._id });

        if (post && user) {

            // remove duplicates
            if (user.beenThere && user.beenThere.length > 0) {

                console.log('Prev user beenThere : ', user.beenThere.length);
                user.beenThere.forEach(i => {
                    console.log(i.id);
                });

                let uniqueObject = {},
                    newArray = [];
                for (let i in user.beenThere) {

                    // Extract the title
                    objTitle = user.beenThere[i]['id'];

                    // Use the title as the index
                    uniqueObject[objTitle] = user.beenThere[i];
                }

                // Loop to push unique object into array
                for (i in uniqueObject) {
                    newArray.push(uniqueObject[i]);
                }

                console.log("Unique");
                newArray.forEach(i => {
                    console.log(i.id);
                });

                // check if exist
                if (newArray.some(e => String(e.id) == String(postId))) {
                    // exists then remove
                    console.log('Removing');
                    user.beenThere = newArray.filter(beenThere => String(beenThere.id) != String(postId));
                } else {
                    // insert
                    console.log('Inserting');

                    user.beenThere = [...newArray, {
                        id: postId,
                        addedDate: Date.now(),
                        url: url
                    }];
                }
            } else {
                user['beenThere'] = [{
                    id: postId,
                    addedDate: Date.now(),
                    url: url

                }];
            }


            console.log('Current user beenThere : ', user.beenThere.length);
            user.beenThere.forEach(i => {
                console.log(i.id);
            });

            const saved = await user.save();
            console.log('saved');
            return saved.beenThere;

        } else {
            return new Error('No user/post matched');
        }


    } catch (error) {
        return error;
    }
}

exports.changeRating = async (postId, userId, weight) => {
    console.log("controller - changeRating");
    try {
        const [post, user] = await Promise.all([PostModel.findOne({
            _id: postId
        }), UserModel.findOne({
            _id: userId
        })]);
        // console.log({post,user});

        const numbers = ['one', 'two', 'three', 'four', 'five'];

        if (post && user && weight) {

            // remove duplicates
            if (post.ratedBy && post.ratedBy.length > 0) {

                // POST.RATEDBY
                // check if exist
                if (post.ratedBy && post.ratedBy.some(e => String(e.user) == String(userId))) {
                    // exists then remove
                    console.log('Updating rating .............');
                    console.log('In post.ratedBy  -----');
                    console.log(post.ratedBy);

                    let userRating;
                    post.ratedBy = post.ratedBy.map(e => {
                        if (String(e.user) == String(userId)) {
                            console.log({ e });

                            const a = JSON.parse(JSON.stringify(e));
                            userRating = { ...a };
                            console.log({ userRating });
                            e['weight'] = weight;
                            e['modifiedOn'] = Date.now();
                            console.log({ userRating });

                        }
                        return e;
                    });

                    // update post ratings
                    if (post.ratings && userRating) {
                        console.log('In post.ratedBy  -----');

                        console.log('Decrement userRating ', userRating['weight'], " star");
                        console.log('Prev value ', post.ratings[numbers[userRating['weight'] - 1]]['votes']);
                        if (post.ratings[numbers[userRating['weight'] - 1]]['votes'] > 0) {
                            post.ratings[numbers[userRating['weight'] - 1]]['votes'] -= 1;
                        } else {
                            post.ratings[numbers[userRating['weight'] - 1]]['votes'] = 0;
                        }

                        console.log('New value ', post.ratings[numbers[userRating['weight'] - 1]]['votes']);

                    }
                    console.log('Increment userRating ', weight, " star");
                    console.log('Prev value ', post.ratings[numbers[weight - 1]]['votes']);
                    post.ratings[numbers[weight - 1]]['votes'] += 1;
                    console.log('New value ', post.ratings[numbers[weight - 1]]['votes']);


                } else {
                    // insert
                    console.log('Adding new rating ................');
                    console.log('In post.ratedBy  -----');
                    post.ratedBy = [...post.ratedBy, {
                        user: userId,
                        weight: weight,
                        ratedOn: Date.now(),
                        modifiedOn: Date.now()
                    }];

                    post.ratings[numbers[weight - 1]]['votes'] += 1;

                }


            } else {

                console.log('Adding new rating ................');

                post['ratings'][numbers[weight - 1]]['votes'] = 1;
                post['ratedBy'] = [{
                    user: userId,
                    weight: weight,
                    ratedOn: Date.now(),
                    modifiedOn: Date.now()
                }]


            }


            // USER.RATINGS
            if (user.ratings && user.ratings.length > 0) {

                // check if exist
                if (user.ratings && user.ratings.some(e => String(e.post) == String(postId))) {
                    // exists then remove
                    console.log('Removing rating \nFrom user.ratings');
                    user.ratings = user.ratings.map(e => {
                        if (String(e.post) == String(postId)) {
                            e['weight'] = weight;
                            e['modifiedOn'] = Date.now();
                        }
                        return e;
                    });

                } else {
                    // insert
                    console.log('Appending new rating \nIn user.ratings');
                    user.ratings = [...user.ratings, {
                        post: postId,
                        weight: weight,
                        ratedOn: Date.now(),
                        modifiedOn: Date.now()
                    }];

                }

            } else {
                console.log('Adding new rating \nIn user.ratings');
                user.ratings = [{
                    post: postId,
                    weight: weight,
                    ratedOn: Date.now(),
                    modifiedOn: Date.now()
                }];
            }

            console.log('Current post ratings : ', post.ratings);
            console.log('Current post ratedBy : ', post.ratedBy);
            // console.log('Current user ratings : ', user.ratings);
            // post.ratedBy.forEach( i => {
            //     console.log({"weight": i.weight});
            // });
            console.log("post.ratings", post.ratings);
            const [rating, totalVotes] = calcRating(post.ratings);
            console.log({ rating, totalVotes });
            post['rating'] = rating;
            post['totalVotes'] = totalVotes;

            const savedPost = await post.save();
            const savedUser = await user.save();

            // console.log({savedPost, savedUser});
            const result = savedPost.ratedBy.filter(i => String(i.user) == String(userId));
            console.log("Result", result);
            return result[0];

        } else {
            return new Error('No user/post matched');
        }


    } catch (error) {
        return error;
    }
}

exports.removeRating = async (postId, userId) => {
    console.log("controller - removeRating");
    try {
        const [post, user] = await Promise.all([PostModel.findOne({
            _id: postId
        }), UserModel.findOne({
            _id: userId
        })]);
        // console.log({post,user});

        const numbers = ['one', 'two', 'three', 'four', 'five'];

        if (post && user) {

            // remove duplicates
            if (user.ratings && user.ratings.length > 0 && post.ratedBy && post.ratedBy.length > 0) {



                // USER.RATINGS
                // check if exist
                if (user.ratings.some(e => String(e.post) == String(postId))) {
                    // exists then remove
                    console.log('Removing rating from user.ratings');
                    user.ratings = user.ratings.filter(e => String(e.post) != String(postId));

                }

                // POST.RATEDBY
                // check if exist
                if (post.ratedBy.some(e => String(e.user) == String(userId))) {

                    // find rating
                    const userRating = { ...JSON.parse(JSON.stringify(post.ratedBy.find(e => String(e.user) == String(userId)))) };
                    console.log({ userRating });

                    // exists then remove
                    console.log('Removing rating from post.ratedBy');
                    post.ratedBy = post.ratedBy.filter(e => String(e.user) != String(userId));


                    // update post ratings
                    if (post.ratings && userRating) {

                        console.log('Decrement userRating ', userRating['weight'], " star");
                        console.log('Prev value ', post.ratings[numbers[userRating['weight'] - 1]]['votes']);
                        if (post.ratings[numbers[userRating['weight'] - 1]]['votes'] > 0) {
                            post.ratings[numbers[userRating['weight'] - 1]]['votes'] -= 1;
                        } else {
                            post.ratings[numbers[userRating['weight'] - 1]]['votes'] = 0;
                        }
                        console.log('New value ', post.ratings[numbers[userRating['weight'] - 1]]['votes']);

                    }

                }

            }


            console.log('Current post ratings : ', post.ratings);
            console.log('Current post ratedBy : ', post.ratedBy);
            console.log('Current user ratings : ', user.ratings);
            // post.ratedBy.forEach( i => {
            //     console.log({"weight": i.weight});
            // });

            const savedPost = await post.save();
            const savedUser = await user.save();

            // console.log({savedPost, savedUser});
            const result = savedPost.ratedBy.filter(i => String(i.user) == String(userId));
            console.log("Result", result);
            return true;

        } else {
            return new Error('No user/post matched');
        }


    } catch (error) {
        return error;
    }
}

exports.saveCollection = async (collectionId, userId, url, placesCount) => {
    console.log("controller - savedCollections");
    try {
        const [collection, user] = await Promise.all([
            CollectionModel.findOne({
                _id: collectionId
            }), UserModel.findOne({
                _id: userId
            })]);
        // console.log({collection,user});

        if (collection && user) {

            // remove duplicates
            if (user.savedCollections) {

                console.log('Prev user savedCollections : ', user.savedCollections.length);
                user.savedCollections.forEach(i => {
                    console.log(i.id);
                });

                // remove duplicate
                let uniqueObject = {},
                    newArray = [];
                for (let i in user.savedCollections) {

                    // Extract the title
                    objTitle = user.savedCollections[i]['id'];

                    // Use the title as the index
                    uniqueObject[objTitle] = user.savedCollections[i];
                }

                // Loop to push unique object into array
                for (i in uniqueObject) {
                    newArray.push(uniqueObject[i]);
                }

                console.log("Unique");
                newArray.forEach(i => {
                    console.log(i.id);
                });

                // check if exist
                if (newArray.some(e => String(e.id) == String(collectionId))) {
                    // exists then remove
                    console.log('Removing');
                    user.savedCollections = newArray.filter(collection => String(collection.id) != String(collectionId));
                } else {
                    // insert
                    console.log('Inserting');

                    user.savedCollections = [...newArray, {
                        id: collectionId,
                        addedDate: Date.now(),
                        url: url,
                        placesCount: placesCount
                    }];
                }
            } else {
                user['savedCollections'] = [{
                    id: collectionId,
                    addedDate: Date.now(),
                    url: url,
                    placesCount: placesCount

                }];
            }


            console.log('Current user savedCollections : ', user.savedCollections.length);
            user.savedCollections.forEach(i => {
                console.log(i.id);
            });

            const saved = await user.save();
            console.log('saved');
            return saved;

        } else {
            return new Error('No user/post matched');
        }


    } catch (error) {
        return error;
    }
}


// GET -------------------------------------------------- GET ----------------------

exports.getPostInitData = async (limit = 15) => {

    try {

        const [state, district, category] = await Promise.all([
            StateModel.find({}, {
                id: 1,
                name: 1
            }).sort({
                name: 1
            }),
            DistrictModel.find({}, {
                id: 1,
                name: 1,
                state: 1
            }).populate('state', 'name id').sort({
                name: 1
            }),
            CategoryModel.find({}, {
                id: 1,
                name: 1
            }).sort({
                name: 1
            })
        ]);

        console.log(state, district, category);
        return {
            result: {
                state,
                district,
                category
            }
        };

    } catch (error) {
        return {
            error
        };
    }

}



exports.getReviews = async (req, res, next) => {
    const userId = req.params.userId;
    if (userId) {
        try {
            const posts = await UserModel.find({
                userId: userId
            }, {
                reviews: 1
            })
                .populate(
                    'reviews', 'name description images'
                );
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({
                error: error,
                message: 'Unexpected error occurred.'
            });
        }
    } else {
        res.status(500).json({
            error: true,
            message: 'Invalid user.'
        });
    }
}







exports.getExtraData = async (userId) => {
    try {

        const postsCount = await PostModel.countDocuments({
            userId
        });

        const productsCount = await Product.countDocuments({
            userId
        });
        // const reviewsCount =  await PostModel.find({ userId: req.user._id });
        // const bookmarksCount =  await PostModel.find({ userId: req.user._id });
        // const beenThereCount =  await PostModel.find({ userId: req.user._id });
        console.log({
            postsCount,
            productsCount
        });
        return {
            postsCount,
            productsCount
        };

    } catch (error) {
        console.log({
            error
        });

        return {};
    }
}


exports.saveRecentPost = async (postId, userId) => {
    try {

        const post = await UserModel.findOne({
            _id: userId
        }, {
            recentlyViewedPosts: 1
        });
        const recents = post.recentlyViewedPosts;
        let recentsToSaved;
        console.log({
            postId,
            userId
        });
        console.log({
            "Before filter": recents,
            postId,
            userId
        });
        recentsToSaved = recents.filter((item) => {
            console.log(item.id, '---', postId);
            return String(item.id) != String(postId);
        });
        console.log({
            'After Filter': recentsToSaved
        });

        if (recentsToSaved && recentsToSaved.length >= 10) {
            recentsToSaved = [...recentsToSaved.splice(1, 10), {
                id: postId,
                date: Date.now()
            }]
        } else {
            recentsToSaved = [...recentsToSaved, {
                id: postId,
                date: Date.now()
            }];
        }
        console.log({
            recentsToSaved
        });

        const saved = await UserModel.findOneAndUpdate({
            _id: userId
        }, {
            recentlyViewedPosts: recentsToSaved
        });
        console.log({
            saved
        });
        return {
            result: true
        };

    } catch (error) {
        console.log({
            error
        });
        return {
            error: error
        };
    }
}

exports.getPost = async (req, res, next) => {
    try {

        const post = await PostModel.findOne({
            _id: req.params.postId,
            userId: req.user._id
        });
        console.log({
            post
        });

        res.status(200).json(post);

    } catch (error) {
        console.log({
            error
        });
        res.status(500).json({
            error: error
        });
    }
}



exports.getBookmarks = async (userId) => {
    try {
        const user = await UserModel.findOne({ _id: userId }, { bookmarks: 1 })
            .populate('bookmarks.id', ' name description images ');
        console.log({ user });
        if (user) {
            return user.bookmarks ? user.bookmarks : null;
        } else {
            return null;
        }
    } catch (e) {
        console.log({ e });
        return null;
    }
}

exports.getBeenThere = async (userId) => {
    try {
        const user = await UserModel.findOne({ _id: userId }, { beenThere: 1 })
            .populate('beenThere.id', ' name description images ');
        console.log({ user });
        if (user) {
            return user.beenThere ? user.beenThere : null;
        } else {
            return null;
        }
    } catch (e) {
        console.log({ e });
        return null;
    }
}

exports.getWishlistProducts = async (userId) => {
    try {
        const user = await UserModel.findOne({ _id: userId })
            .populate('wishlistProduct.id');
        console.log({ user });
        if (user) {

            if( user.wishlistProduct ) {
                let wishlist = user.wishlistProduct;
                wishlist = wishlist.map( e => e.id );
                return wishlist;
            }
        } else {
            return null;
        }
    } catch (e) {
        console.log({ e });
        return null;
    }
}


exports.getRecentlyViewedPosts = async (userId) => {
    try {
        const user = await UserModel.findOne({ _id: userId }, { recentlyViewedPosts: 1 })
            .populate('recentlyViewedPosts.id', ' name description images ');
        console.log({ user });
        if (user) {
            return user.recentlyViewedPosts ? user.recentlyViewedPosts : null;
        } else {
            return null;
        }
    } catch (e) {
        console.log({ e });
        return null;
    }
}

exports.getUserPosts = async (userId) => {
    try {
        const posts = await PostModel.find({
            userId: userId
        }, {
            name: 1,
            description: 1,
            images: 1,
            status: 1
        }).sort({ createdOn: -1 });
        return posts;
    } catch (error) {
        console.log({ error });
        return null;
    }
}

exports.getSavedCollections = async (userId) => {
    return await UserModel.findOne({ _id: userId }, { savedCollections: 1 })
        .populate('savedCollections.id');
}


exports.addReview = async (doc, req) => {

    try {
        console.log('controller addReview');
        const review = await new ReviewModel(doc).save();
        const user = req.user;
        user.reviews = [...user.reviews, review._id];
        const saved = await user.save();
        return await ReviewModel.findOne({ _id: review._id })
            .populate([{ path: 'user', select: 'name images ratings reviews' }]);
    } catch (error) {
        return error;
    }

}
exports.deleteReview = async (reviewId, postId, userId) => {

    try {
        console.log('controller deleteReview');
        const deletedReview = await ReviewModel.deleteOne({
            _id: reviewId,
            post: postId,
            user: userId
        });
        console.log({ deletedReview });
        return 'done';
    } catch (error) {
        return error;
    }

}

exports.changeLikeReview = async (postId, userId, reviewId) => {
    console.log("controller - changeLikeReview");

    try {
        let [post, user, review] = await Promise.all([
            PostModel.findOne({
                _id: postId
            }),
            UserModel.findOne({
                _id: userId
            }),
            ReviewModel.findOne({ _id: reviewId, post: postId })
        ]);
        console.log({ review });

        // const numbers = ['one', 'two', 'three', 'four', 'five'];

        if (post && user && review) {

            // remove duplicates
            if (review && review.likes && review.likes.length > 0) {

                // POST.RATEDBY
                // check if exist
                if (review.likes && review.likes.some(e => String(e) == String(userId))) {
                    // exists then remove
                    console.log('Updating likes .............');
                    console.log("Total Likes ", review.likes.length);

                    review.likes = review.likes.filter(e => String(e) != String(userId));
                    console.log('Updated likes .............');
                    console.log("Total Likes ", review.likes.length);

                } else {
                    // insert
                    console.log('Adding new like ................');
                    console.log("Total Likes ", review.likes.length);

                    review.likes = [...review.likes, userId];

                    console.log('Added new like .............');
                    console.log("Total Likes ", review.likes.length);

                }


            } else {

                console.log('Adding new like ................');
                review['likes'] = [userId];
                console.log("Total Likes ", review.likes.length);


            }


            console.log('LIKES : ', review.likes);

            const savedReview = await review.save();
            const totalLikes = await savedReview.totalLikes;

            console.log("totalLikes", totalLikes);
            console.log("savedReview", savedReview);
            return totalLikes;

        } else {
            return new Error('No user/post matched');
        }


    } catch (error) {
        console.log({ error });
        return error;
    }
}


exports.addCommentOnReview = async (doc, reviewId, req) => {

    try {
        console.log('controller addCommentOnReview');
        console.log({ doc, reviewId });
        const review = await ReviewModel.findOneAndUpdate({ _id: reviewId }, { $push: { replies: { $each: [doc], $position: 0 } } });
        console.log({ review });

        const reviewCommented = await ReviewModel.findOne({ _id: reviewId }, { replies: { $slice: 1 } })
            .populate({ path: 'user', select: 'name images ratings  replies' })
            .populate({ path: 'replies.user', select: 'name images ratings  replies' });
        console.log({ reviewCommented });

        console.log("comment", reviewCommented.replies[0]);
        return reviewCommented.replies[0];
        // const user = req.user;
        // user.reviews = [...user.reviews, review._id ];
        // const saved = await user.save();
        // return await ReviewModel.findOne({ _id: review._id})
        // .populate([{ path: 'user', select: 'name images ratings reviews'}]);
    } catch (error) {
        return error;
    }

}

exports.reportReview = async (postId, userId, reviewId, comment, reasons) => {

    try {
        console.log('controller reportReview');
        console.log({ reviewId });
        const alreadyReported = await ReportModel.findOne({ user: userId, review: reviewId });
        console.log({ alreadyReported });

        if (alreadyReported) {
            throw new Error('Already reported');
        }
        const reviewUser = await ReviewModel.findOne({ _id: reviewId });
        const report = await new ReportModel({
            post: postId,
            user: userId,
            review: reviewId,
            reviewUser: reviewUser.user,
            comment: comment,
            reasons: reasons,
            createdOn: Date.now(),
            modifiedOn: Date.now()
        }).save();
        console.log({ report });

        console.log("report status", report.status);
        return report;

    } catch (error) {
        return Promise.reject(error);
    }

}
