const express = require('express');
const sgMail = require("@sendgrid/mail");

const router = express.Router();
const siteController = require('../controllers/site');
const careerRoute = require('./site/career');
const contactRoute = require('./site/contact');
const CareerModel = require('./../models/career').model;
const ClaimModel = require('./../models/claim').model;
const PostModel = require('./../models/post').model;
const AdvertisementModel = require('./../models/advertisement').model;
const AdsLEDAndBannerModel = require('./../models/adsLedAndBanner').model;
const adsLedAndBannerAndOthersType = require('./../models/adsLedAndBannerAndOthersType').model;
const OrderModel = require('./../models/order').model;
const StateModel = require('./../models/state').model;

const UploaderImages = require("./../utils/fileUpload");
const Uploader = require("./../utils/multer_config");
const UploaderVideos = require("../utils/videoUploader");

// twilio integration
const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID_DEV;
const authToken = process.env.TWILIO_AUTH_TOKEN_DEV;
const twilio_client = new twilio(accountSid, authToken);


//Sendgrid integration
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}


function checkAuthenticatedAjax(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(500).json({ message: "Not authorized" });
}




router.get('/stats', siteController.stats);



router.get('/claim-listing', (req, res, next) => {
    res.render('./layout/claim.ejs');
});

router.post('/claim-listing/add', Uploader.single('proof'), checkAuthenticatedAjax, async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);

    try {

        if (!req.file) {
            throw new Error('File upload failed');
        }

        const post = await PostModel.findOne({ _id: req.body.post });
        if (await ClaimModel.findOne({ post: post._id, user: req.user._id })) {
            throw new Error('Already claimed');
        }
        const claim = new ClaimModel({
            fullName: req.body.fullName,
            email: req.body.email,
            mobile: req.body.mobile,
            message: req.body.message,
            proofFile: req.file.filename,
            post: post._id,
            user: req.user._id,
            previousUser: post.userId,
            createdOn: Date.now()
        });

        const saved = await claim.save();
        const msg = {
            to: req.body.email,
            from: process.env.SUPPORT_EMAIL,
            subject: 'Claim submitted successfully.',
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
                                                            src="images/Logo.png"
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
                                                            href="digitalmanipur.com/users/home"
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
                                                                            style="font-size: 38px;">Claim <span
                                                                                style="font-size: 38px; color: #fc7318;">Listing</span></span></strong></span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <!--[if mso]></td></tr></table><![endif]-->
                                                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
        
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
                                                                    <div style="font-weight:bold">Dear  ${req.body.fullName},</div>
                                                                    <br>
                                                                    <div>We have received your claim request. Thank You for
                                                                        using our service.</div>
                                                                    <br>
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
                                                                                            src="images/facebook2x.png"
                                                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                                                            title="Facebook" width="32" /></a>
                                                                                </td>
                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;"
                                                                                    valign="top"><a href="https://twitter.com/"
                                                                                        target="_blank"><img alt="Twitter"
                                                                                            height="32"
                                                                                            src="images/twitter2x.png"
                                                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                                                            title="Twitter" width="32" /></a>
                                                                                </td>
                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;"
                                                                                    valign="top"><a
                                                                                        href="https://instagram.com/"
                                                                                        target="_blank"><img alt="Instagram"
                                                                                            height="32"
                                                                                            src="images/instagram2x.png"
                                                                                            style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;"
                                                                                            title="Instagram" width="32" /></a>
                                                                                </td>
                                                                                <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;"
                                                                                    valign="top"><a
                                                                                        href="https://www.pinterest.com/"
                                                                                        target="_blank"><img alt="Pinterest"
                                                                                            height="32"
                                                                                            src="images/pinterest2x.png"
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
            subject: 'Claim submission.',
            html: `<p>${req.body.fullName} submitted a claim for ad listing.</p>`
        }
        sgMail.send(msg)
            .then((err, sgm) => {
                console.log({ saved });
                sgMail.send(msg2)
                    .then((err2, sgm2) => {
                        console.log(sgm2);
                        res.status(200).json({ message: "Claim submitted", data: saved });
                    })
                    .catch(mailerr2 => {
                        console.log(mailerr2);
                    })
            })
            .catch(mailerr => {
                console.log(mailerr);
            })

    } catch (error) {
        console.log({ error });
        console.log(error.name);
        console.log(error.message);
        res.status(500).json({ message: error.message ? error.message : "Please try again", error: error });
    }

});

router.get('/add-listing', (req, res, next) => {
    if (req.user) {
        let url = `/users/add-listing`;
        res.redirect(url);
    } else {
        req.session.redirect = 'add-listing';
        req.flash('info', 'Please login to continue.');
        res.redirect('/auth/login');
    }
});

router.get('/terms', (req, res, next) => {

    res.render('./layout/terms.ejs', {
        pageTitle: 'Terms and conditions'
    });
});

router.get('/privacy', (req, res, next) => {

    res.render('./layout/privacy.ejs', {
        pageTitle: 'Privacy policy'
    });
});

router.use('/career', careerRoute);
router.use('/contact', contactRoute);




router.get('/about', (req, res, next) => {

    res.render('./layout/about.ejs');
});


router.get('/mobile-app', (req, res, next) => {

    res.render('./layout/mobile-app.ejs', {
        pageTitle: "Mobile App"
    });
});

router.get('/promote', async (req, res, next) => {
    try {
        const types = await adsLedAndBannerAndOthersType.find();
        const ads = await AdsLEDAndBannerModel.find().sort({
            createdOn: -1
        });
        const states = await StateModel.find();
        res.render('./layout/advertisement.ejs', {
            ads: ads,
            types: types,
            adPageFlag: true,
            states: states,
            pageTitle: 'Advertisement'
        });

    } catch (error) {

    }
});

router.post('/promote/add/video', UploaderVideos.VideoUploader.single('file'), async (req, res, next) => {
    console.log(req.file);
    if (req.file) {
        res.status(200).json({ data: req.file.filename });
    } else {
        console.log("Image upload failed");
        res.status(500).json({ message: "Video upload failed" });
    }
});

router.post('/promote/add/image', async (req, res, next) => {
    try {
        image = await UploaderImages.handleSingleFile('file', req, res);
        console.log(req.file);

        res.status(200).json({ data: image.filename });

    } catch (error) {
        console.log({ error });
        console.log("Video upload failed");
        res.status(500).json({ message: "Image upload failed" });

    }
});

router.post('/promote/add', checkAuthenticatedAjax, async (req, res, next) => {

    console.log("Body ", req.body);
    try {
        const ad = await new AdvertisementModel({
            ...req.body,
            user: req.user._id,
            createdOn: Date.now()
        }).save();
        console.log({ ad });
        res.status(200).json({ message: 'Your advertisement has been booked successfully. Please check your email for more information.' });

    } catch (error) {
        console.log({ error });
        res.status(500).json({ message: 'Please try again later. If you face any problems, please contact us for support.' });
    }
});


module.exports = router;