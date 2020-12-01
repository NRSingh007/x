const url = require('url');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
require("util").inspect.defaultOptions.depth = null;

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: "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"
  }
}));
const fs = require('fs');


// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'digitalmanipurinfo@gmail.com',
//         pass: 'Leibaknew@123456'
//     }
// });


const emailTemplate = (innerHtml) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width" name="viewport"/>
<!--[if !mso]><!-->
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<!--<![endif]-->
<title></title>
<!--[if !mso]><!-->
<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css"/>
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
<table bgcolor="#F5F5F5" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td style="word-break: break-word; vertical-align: top;" valign="top">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#F5F5F5"><![endif]-->
<div style="background-color:transparent;">
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="10" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 10px; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td height="10" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
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
<div class="block-grid two-up no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="325" style="background-color:#FFFFFF;width:325px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 25px; padding-top:25px; padding-bottom:25px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 325px; display: table-cell; vertical-align: top; width: 325px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:25px; padding-bottom:25px; padding-right: 0px; padding-left: 25px;">
<!--<![endif]-->
<div align="left" class="img-container left fullwidthOnMobile fixedwidth" style="padding-right: 0px;padding-left: 0px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="left"><![endif]-->
<div style="font-size:1px;line-height:5px"> </div><img alt="Image" border="0" class="left fullwidthOnMobile fixedwidth" src="images/Logo.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 195px; display: block;" title="Image" width="195"/>
<!--[if mso]></td></tr></table><![endif]-->
</div>
<!--[if (!mso)&(!IE)]><!-->
</div>
<!--<![endif]-->
</div>
</div>
<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
<!--[if (mso)|(IE)]></td><td align="center" width="325" style="background-color:#FFFFFF;width:325px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 25px; padding-left: 0px; padding-top:25px; padding-bottom:25px;"><![endif]-->
<div class="col num6" style="min-width: 320px; max-width: 325px; display: table-cell; vertical-align: top; width: 325px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:25px; padding-bottom:25px; padding-right: 25px; padding-left: 0px;">
<!--<![endif]-->
<div align="right" class="button-container" style="padding-top:10px;padding-right:0px;padding-bottom:10px;padding-left:10px;">
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 0px; padding-bottom: 10px; padding-left: 10px" align="right"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="#" style="height:28.5pt; width:98.25pt; v-text-anchor:middle;" arcsize="37%" stroke="false" fillcolor="#D4E9F9"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#052d3d; font-family:Tahoma, Verdana, sans-serif; font-size:14px"><![endif]--><a href="digitalmanipur.com/users/home" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #052d3d; background-color: #D4E9F9; border-radius: 14px; -webkit-border-radius: 14px; -moz-border-radius: 14px; width: auto; width: auto; border-top: 1px solid #D4E9F9; border-right: 1px solid #D4E9F9; border-bottom: 1px solid #D4E9F9; border-left: 1px solid #D4E9F9; padding-top: 3px; padding-bottom: 3px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:15px;padding-right:15px;font-size:14px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span data-mce-style="font-size: 14px; line-height: 28px;" style="font-size: 14px; line-height: 28px;">My account</span></span></span></a>
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
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #D6E7F0;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#D6E7F0;background-image:url('images/bg_cart_2.png');background-position:top center;background-repeat:no-repeat">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#D6E7F0"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#D6E7F0;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:55px; padding-bottom:60px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 15px; padding-top: 20px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->

                
                      ${innerHtml}
                      <div style="background-color:transparent;">
                      <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #F0F0F0;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:#F0F0F0;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#F0F0F0"><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#F0F0F0;width:650px; border-top: none; border-left: none; border-bottom: none; border-right: none;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr bgcolor='#FFFFFF'><td colspan='3' style='font-size:7px;line-height:18px'>&nbsp;</td></tr><tr><td style='padding-top:15px;padding-bottom:15px' width='25' bgcolor='#FFFFFF'><table role='presentation' width='25' cellpadding='0' cellspacing='0' border='0'><tr><td>&nbsp;</td></tr></table></td><td style="padding-right: 35px; padding-left: 35px; padding-top:15px; padding-bottom:5px;"><![endif]-->
                      <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 600px;">
                      <div style="width:100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="border-top:18px solid #FFFFFF; border-left:25px solid #FFFFFF; border-bottom:18px solid #FFFFFF; border-right:25px solid #FFFFFF; padding-top:15px; padding-bottom:5px; padding-right: 35px; padding-left: 35px;">
                      <!--<![endif]-->
                      <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 15px; padding-left: 15px; padding-top: 15px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                      <div style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:15px;padding-right:15px;padding-bottom:10px;padding-left:15px;">
                      <div style="line-height: 1.2; font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
                      <p style="line-height: 1.2; font-size: 34px; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 41px; margin: 0;"><span style="font-size: 34px;"><span style="color: #fc7318; font-size: 34px;"><strong><span style="font-size: 34px;">Troubles? <br/></span></strong></span><span style="font-size: 34px;">We're here to help you</span></span></p>
                      </div>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                      <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 30px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                      <div style="color:#787878;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:0px;padding-right:10px;padding-bottom:30px;padding-left:10px;">
                      <div style="font-size: 12px; line-height: 1.5; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #787878; mso-line-height-alt: 18px;">
                      <p style="font-size: 18px; line-height: 1.5; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 27px; margin: 0;"><span style="font-size: 18px;">Grow your business online.Grow your business with Digital Manipur. <strong><a href="#" rel="noopener" style="text-decoration: none; color: #2190E3;" target="_blank">digitalmanipurinfo@gmail.com.com</a></strong></span><br/><span style="font-size: 18px;">or call us at <span style="color: #2190e3; font-size: 18px;">(<strong>389</strong>)</span> <span style="color: #2190e3; font-size: 18px;"><strong>839289328932</strong></span> <br/><strong>Monday through Friday 8:30-5:30 PST</strong></span></p>
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
                      <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:5px;"><![endif]-->
                      <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                      <div style="width:100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
                      <!--<![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                      <tbody>
                      <tr style="vertical-align: top;" valign="top">
                      <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
                      <tbody>
                      <tr style="vertical-align: top;" valign="top">
                      <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
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
                      <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
                      <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
                      <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:transparent;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:20px; padding-bottom:60px;"><![endif]-->
                      <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
                      <div style="width:100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:20px; padding-bottom:60px; padding-right: 0px; padding-left: 0px;">
                      <!--<![endif]-->
                      <table cellpadding="0" cellspacing="0" class="social_icons" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;" valign="top" width="100%">
                      <tbody>
                      <tr style="vertical-align: top;" valign="top">
                      <td style="word-break: break-word; vertical-align: top; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                      <table align="center" cellpadding="0" cellspacing="0" class="social_table" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-tspace: 0; mso-table-rspace: 0; mso-table-bspace: 0; mso-table-lspace: 0;" valign="top">
                      <tbody>
                      <tr align="center" style="vertical-align: top; display: inline-block; text-align: center;" valign="top">
                      <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;" valign="top"><a href="https://www.facebook.com/" target="_blank"><img alt="Facebook" height="32" src="images/facebook2x.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;" title="Facebook" width="32"/></a></td>
                      <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;" valign="top"><a href="https://twitter.com/" target="_blank"><img alt="Twitter" height="32" src="images/twitter2x.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;" title="Twitter" width="32"/></a></td>
                      <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;" valign="top"><a href="https://instagram.com/" target="_blank"><img alt="Instagram" height="32" src="images/instagram2x.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;" title="Instagram" width="32"/></a></td>
                      <td style="word-break: break-word; vertical-align: top; padding-bottom: 5px; padding-right: 8px; padding-left: 8px;" valign="top"><a href="https://www.pinterest.com/" target="_blank"><img alt="Pinterest" height="32" src="images/pinterest2x.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: none; display: block;" title="Pinterest" width="32"/></a></td>
                      </tr>
                      </tbody>
                      </table>
                      </td>
                      </tr>
                      </tbody>
                      </table>
                      <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                      <div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.5;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                      <div style="font-size: 12px; line-height: 1.5; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 18px;">
                      <p style="font-size: 14px; line-height: 1.5; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">Digital Manipur - The Largest Local Search Engine </p>
                      <p style="font-size: 14px; line-height: 1.5; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">Leibak Information Technology Pvt Ltd. </p>
                      <p style="font-size: 14px; line-height: 1.5; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 21px; margin: 0;">Khurai Thoidingjam Leikai, Imphal East, Manipur, India. </p>
                      </div>
                      </div>
                      <!--[if mso]></td></tr></table><![endif]-->
                      <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
                      <tbody>
                      <tr style="vertical-align: top;" valign="top">
                      <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
                      <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px dotted #C4C4C4; height: 0px; width: 60%;" valign="top" width="60%">
                      <tbody>
                      <tr style="vertical-align: top;" valign="top">
                      <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
                      </tr>
                      </tbody>
                      </table>
                      </td>
                      </tr>
                      </tbody>
                      </table>
                      <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
                      <div style="color:#4F4F4F;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
                      <div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #4F4F4F; mso-line-height-alt: 14px;">
                      <p style="font-size: 14px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;"><a href="#" rel="noopener" style="text-decoration: none; color: #2190E3;" target="_blank"><strong>Help&amp; FAQ's</strong></a> |  <strong><a href="#" rel="noopener" style="text-decoration: none; color: #2190E3;" target="_blank">Returns</a> </strong> |  <span style="background-color: transparent; font-size: 14px;">1-998-9283-19832</span></span></p>
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
                      </html>`;

module.exports.verifyEmailMsgBody = (domain, token, data) => {
  return `
  <div style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:5px;padding-left:15px;">
<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
<p style="font-size: 38px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 46px; margin: 0;"><span style="font-size: 38px;"><strong><span style="font-size: 38px;">Registration <span style="font-size: 38px; color: #fc7318;">& Verification</span></span></strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
<div style="color:#052D3D;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052D3D; mso-line-height-alt: 14px;">
<p style="font-size: 22px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 26px; margin: 0;"><span style="font-size: 22px;"><strong><span style="font-size: 22px;">You left a few things in your cart :(</span></strong></span></p>
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
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:20px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table style="" border="0" cellpadding="0" cellspacing="0" align="center" width="640" bgcolor="#FFFFFF"> 
                        <tbody>                  
                        <tr>               
                            <td colspan="4" style="padding:30px 20px 10px;font-size:14px"> 
                                <div style="font-weight:bold">Dear ${data.name},</div> 
                                <br>                                      
                                <div>
                                <span>Thanks for your Registration.</span><br>
                                <span>Please click the verfication link or copy paste the URL to activate your Digital Manipur Account.</span>
                                </div>      
                                <br>
                                <div align="center" class="button-container"
																style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
																<a href="${domain}/auth/verify-account/${token}"
																	style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #fc7318; border-radius: 15px; -webkit-border-radius: 15px; -moz-border-radius: 15px; width: auto; width: auto; border-top: 1px solid #fc7318; border-right: 1px solid #fc7318; border-bottom: 1px solid #fc7318; border-left: 1px solid #fc7318; padding-top: 5px; padding-bottom: 5px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
																	target="_blank"><span
																		style="padding-left:20px;padding-right:20px;font-size:18px;display:inline-block;"><span
																			style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span
																				data-mce-style="font-size: 18px; line-height: 36px;"
																				style="font-size: 18px; line-height: 36px;"><strong>VERIFICATION
																					LINK › </strong></span></span></span></a>

															</div><br>                                  
                                <div style="font-size:16px;font-weight:bold;text-align:center;line-height:30px"> 
                                    <span style="border-bottom:1px solid #ddd;padding-bottom:5px">Registration Details</span>  
                                </div>                       
                                <br>                          
                                <div>                  
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                        <tbody>           
                                            <tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #ddd;padding:7px 10px">Name:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #999;padding:7px 10px"><strong>${data.name}</strong></td> 
                                            </tr> 

                                            <tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Email:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong><a href="mailto:${data.email}" target="_blank">${data.email}</a></strong></td> 
                                            </tr> 
                                        </tbody>                                
                                    </table>                            
                                </div>                              
                                                      
                            </td>              
                        </tr>              
                        <tr>              
                            <td colspan="4" style="padding:20px;font-size:14px"> 
                                <div style="font-size:14px"> <span>Regards,</span> </div>    
                                <div style="font-size:14px;padding-top:10px"> <span>Digital Manipur.</span> </div> 
                            </td>                    
                        </tr>                 
                    </tbody></table>
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
    `;
}

module.exports.verifyEmailSuccessMsgBody = (data) => {
  return `
  <div style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:5px;padding-left:15px;">
<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
<p style="font-size: 38px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 46px; margin: 0;"><span style="font-size: 38px;"><strong><span style="font-size: 38px;">Registration <span style="font-size: 38px; color: #fc7318;">& Verification</span></span></strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
<div style="color:#052D3D;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052D3D; mso-line-height-alt: 14px;">
<p style="font-size: 22px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 26px; margin: 0;"><span style="font-size: 22px;"><strong><span style="font-size: 22px;">You left a few things in your cart :(</span></strong></span></p>
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
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:20px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table style="" border="0" cellpadding="0" cellspacing="0" align="center" width="640" bgcolor="#FFFFFF"> 
                        <tbody>                  
                        <tr>               
                            <td colspan="4" style="padding:30px 20px 10px;font-size:14px"> 
                                <div style="font-weight:bold">Dear ${data.name},</div> 
                                <br>                                      
                                <div>
                                <span>Thanks for your Registration.</span><br>
                                <span>Your email has been successfully verified.</span>
                                </div>      
                                <br>
                                                                 
                                <div style="font-size:16px;font-weight:bold;text-align:center;line-height:30px"> 
                                    <span style="border-bottom:1px solid #ddd;padding-bottom:5px">Registration Details</span>  
                                </div>                       
                                <br>                          
                                <div>                  
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                        <tbody>           
                                            <tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #ddd;padding:7px 10px">Name:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #999;padding:7px 10px"><strong>${data.name}</strong></td> 
                                            </tr> 

                                            <tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Email:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong><a href="mailto:${data.email}" target="_blank">${data.email}</a></strong></td> 
                                            </tr> 
                                        </tbody>                                
                                    </table>                            
                                </div>                              
                                                      
                            </td>              
                        </tr>              
                        <tr>              
                            <td colspan="4" style="padding:20px;font-size:14px"> 
                                <div style="font-size:14px"> <span>Regards,</span> </div>    
                                <div style="font-size:14px;padding-top:10px"> <span>Digital Manipur.</span> </div> 
                            </td>                    
                        </tr>                 
                    </tbody></table>
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
    `;
}

module.exports.newVerifyEmailMsgBody = (domain, token) => {
  return `
  <div style="margin-bottom: 10px">
  <img alt="Image" border="0" src="images/Logo.png" title="Image" width="195" />
</div>
<div
  style="background-color: #CAE3EA; text-align: center;font-family: 'Roboto', sans-serif; font-size: 35px; font-weight: 800; padding-top: 20px; padding-bottom: 20px ;">
  <span style="color: black;">Email </span> <span style="color: #F6660E;">Verification</span>
</div>
  <h3>You've requested a new account verification link.</h3>
  <h3>Let's confirm your email address.</h3>
  <p class="py-3">By clicking on the following link, you are confirming your email address.</p>
  <div class="center-items">
    <a class="comfirm" href="${domain}/auth/verify-account/${token}" >Verify Email Address</a>
  </div>
  `;
}

module.exports.resetPasswordRequestMsgBody = (domain, token) => {
  return `
  <div style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:5px;padding-left:15px;">
<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
<p style="font-size: 38px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 46px; margin: 0;"><span style="font-size: 38px;"><strong><span style="font-size: 38px;">Reset <span style="font-size: 38px; color: #fc7318;">Password</span></span></strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
<div style="color:#052D3D;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052D3D; mso-line-height-alt: 14px;">
<p style="font-size: 22px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 26px; margin: 0;"><span style="font-size: 22px;"><strong><span style="font-size: 22px;">You left a few things in your cart :(</span></strong></span></p>
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
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:20px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table style="" border="0" cellpadding="0" cellspacing="0" align="center" width="640" bgcolor="#FFFFFF"> 
                        <tbody>                  
                        <tr>               
                            <td colspan="4" style="padding:30px 20px 10px;font-size:14px"> 
                                <div style="font-weight:bold">You've requested a password reset</div> 
                                <br>                                      
                                <div>
                                <span>Thanks for your Registration.</span><br>
                                <span>By clicking on the following link, you will be redirected to password reset page.</span>
                                </div>      
                                <br>
                                <div align="center" class="button-container"
																style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
																<a href="${domain}/auth/password_reset_form/${token}"
																	style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #fc7318; border-radius: 15px; -webkit-border-radius: 15px; -moz-border-radius: 15px; width: auto; width: auto; border-top: 1px solid #fc7318; border-right: 1px solid #fc7318; border-bottom: 1px solid #fc7318; border-left: 1px solid #fc7318; padding-top: 5px; padding-bottom: 5px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;"
																	target="_blank"><span
																		style="padding-left:20px;padding-right:20px;font-size:18px;display:inline-block;"><span
																			style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><span
																				data-mce-style="font-size: 18px; line-height: 36px;"
																				style="font-size: 18px; line-height: 36px;"><strong>RESET PASSWORD › </strong></span></span></span></a>

															</div><br>                                                       
                            </td>              
                        </tr>              
                        <tr>              
                            <td colspan="4" style="padding:20px;font-size:14px"> 
                                <div style="font-size:14px"> <span>Regards,</span> </div>    
                                <div style="font-size:14px;padding-top:10px"> <span>Digital Manipur.</span> </div> 
                            </td>                    
                        </tr>                 
                    </tbody></table>
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
    `;
}

module.exports.deleteAccountRequestMsgBody = (domain, username) => {
  return `
  <div style="margin-bottom: 10px">
  <img alt="Image" border="0" src="images/Logo.png" title="Image" width="195" />
</div>
<div
  style="background-color: #CAE3EA; text-align: center;font-family: 'Roboto', sans-serif; font-size: 35px; font-weight: 800; padding-top: 20px; padding-bottom: 20px ;">
  <span style="color: black;">Account </span> <span style="color: #F6660E;">Deletion</span>
</div>
  <h4>Hi ${username},</h4>
  <p class="py-3">We have received a request to permanently delete your account. Your account has been deactivated from the site and will be permanently deleted within 14 days.</p>
  
  
  <p class="py-3">
  Thanks, <br/>
  Digital Manipur Support Team
  </p>
  `;
}

module.exports.jobApplicationAck = (domain, username, data) => {
  return `
  <div style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:5px;padding-left:15px;">
  <div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
  <p style="font-size: 38px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 46px; margin: 0;"><span style="font-size: 38px;"><strong><span style="font-size: 38px;">Job <span style="font-size: 38px; color: #fc7318;">Application</span></span></strong></span></p>
  </div>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
  <div style="color:#052D3D;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
  <div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052D3D; mso-line-height-alt: 14px;">
  <p style="font-size: 22px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 26px; margin: 0;"><span style="font-size: 22px;"><strong><span style="font-size: 22px;">You left a few things in your cart :(</span></strong></span></p>
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
  <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
  <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
  <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:20px;"><![endif]-->
  <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
  <div style="width:100% !important;">
  <!--[if (!mso)&(!IE)]><!-->
  <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
  <!--<![endif]-->
  <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table style="" border="0" cellpadding="0" cellspacing="0" align="center" width="640" bgcolor="#FFFFFF"> 
                          <tbody>                  
                          <tr>               
                              <td colspan="4" style="padding:30px 20px 10px;font-size:14px"> 
                                  <div style="font-weight:bold">Hi ${username},</div> 
                                  <br>                                      
                                  <div>Thank you for applying the job. We have received your application form. Our HR team will inform you regarding the recruitment process.</div>      
                                  <br>                                  
                                  <div style="font-size:16px;font-weight:bold;text-align:center;line-height:30px"> 
                                      <span style="border-bottom:1px solid #ddd;padding-bottom:5px">Information Submitted</span>  
                                  </div>                       
                                  <br>                          
                                  <div>                  
                                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                          <tbody>           
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #ddd;padding:7px 10px">Role:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #999;padding:7px 10px"><strong>${data.role}</strong></td> 
                                              </tr> 
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Job Location:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.location}</strong></td> 
                                              </tr> 
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Job Full Name:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.fullName}</strong></td> 
                                              </tr> 
  
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Email:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong><a href="mailto:${data.email}" target="_blank">${data.email}</a></strong></td> 
                                              </tr> 
                                              
                        <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Mobile:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.mobile}</strong></td> 
                                              </tr> 
  
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Expirience(years):</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.yearsOfExperience}</strong></td> 
                                              </tr>				
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Previous Organization:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.previousOrganization}</strong></td> 
                                              </tr>				
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Address:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.city}</strong></td> 
                                              </tr>				
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Annual Compensation:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.currentAnnualCompensation}</strong></td> 
                                              </tr>				
  
                                          </tbody>                                
                                      </table>                            
                                  </div>                              
                                                        
                              </td>              
                          </tr>              
                          <tr>              
                              <td colspan="4" style="padding:20px;font-size:14px"> 
                                  <div style="font-size:14px"> <span>Regards,</span> </div>    
                                  <div style="font-size:14px;padding-top:10px"> <span>Digital Manipur.</span> </div> 
                              </td>                    
                          </tr>                 
                      </tbody></table>
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
`;
}


module.exports.contactAdmin = (domain, data) => {
  return `
  <div style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:5px;padding-left:15px;">
<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
<p style="font-size: 38px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 46px; margin: 0;"><span style="font-size: 38px;"><strong><span style="font-size: 38px;">Enquiry <span style="font-size: 38px; color: #fc7318;">Submission</span></span></strong></span></p>
</div>
</div>
<!--[if mso]></td></tr></table><![endif]-->
<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
<div style="color:#052D3D;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052D3D; mso-line-height-alt: 14px;">
<p style="font-size: 22px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 26px; margin: 0;"><span style="font-size: 22px;"><strong><span style="font-size: 22px;">You left a few things in your cart :(</span></strong></span></p>
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
<div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
<div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
<!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:20px;"><![endif]-->
<div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
<div style="width:100% !important;">
<!--[if (!mso)&(!IE)]><!-->
<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
<!--<![endif]-->
<table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
<table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
<tbody>
<tr style="vertical-align: top;" valign="top">
<td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table style="" border="0" cellpadding="0" cellspacing="0" align="center" width="640" bgcolor="#FFFFFF"> 
                        <tbody>                  
                        <tr>               
                            <td colspan="4" style="padding:30px 20px 10px;font-size:14px"> 
                                <div style="font-weight:bold">Dear ${data.fullName},</div> 
                                <br>                                      
                                <div>Thanks for your Enquiry.</div>      
                                <br>                                  
                                <div style="font-size:16px;font-weight:bold;text-align:center;line-height:30px"> 
                                    <span style="border-bottom:1px solid #ddd;padding-bottom:5px">Enquiry Details</span>  
                                </div>                       
                                <br>                          
                                <div>                  
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                        <tbody>           
                                            <tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #ddd;padding:7px 10px">Name:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #999;padding:7px 10px"><strong>${data.fullName}</strong></td> 
                                            </tr> 

                                            <tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Email:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong><a href="mailto:${data.email}" target="_blank">${data.email}</a></strong></td> 
                                            </tr> 
                                            
											<tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Mobile:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.mobile}</strong></td> 
                                            </tr> 

                                            <tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Subject:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.subject}</strong></td> 
                                            </tr>				
                                            <tr>            
                                                <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Comments:</td> 
                                                <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.message}</strong></td> 
                                            </tr>				

                                        </tbody>                                
                                    </table>                            
                                </div>                              
                                                      
                            </td>              
                        </tr>              
                        <tr>              
                            <td colspan="4" style="padding:20px;font-size:14px"> 
                                <div style="font-size:14px"> <span>Regards,</span> </div>    
                                <div style="font-size:14px;padding-top:10px"> <span>Digital Manipur.</span> </div> 
                            </td>                    
                        </tr>                 
                    </tbody></table>
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
`;
}


module.exports.contactUser = (domain, data) => {
  return `
  <div style="color:#052d3d;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:20px;padding-right:10px;padding-bottom:5px;padding-left:15px;">
  <div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052d3d; mso-line-height-alt: 14px;">
  <p style="font-size: 38px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 46px; margin: 0;"><span style="font-size: 38px;"><strong><span style="font-size: 38px;">Enquiry <span style="font-size: 38px; color: #fc7318;">Submission</span></span></strong></span></p>
  </div>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 0px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
  <div style="color:#052D3D;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:0px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
  <div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #052D3D; mso-line-height-alt: 14px;">
  <p style="font-size: 22px; line-height: 1.2; text-align: center; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 26px; margin: 0;"><span style="font-size: 22px;"><strong><span style="font-size: 22px;">You left a few things in your cart :(</span></strong></span></p>
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
  <div class="block-grid" style="Margin: 0 auto; min-width: 320px; max-width: 650px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF;">
  <div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
  <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:650px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
  <!--[if (mso)|(IE)]><td align="center" width="650" style="background-color:#FFFFFF;width:650px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:20px;"><![endif]-->
  <div class="col num12" style="min-width: 320px; max-width: 650px; display: table-cell; vertical-align: top; width: 650px;">
  <div style="width:100% !important;">
  <!--[if (!mso)&(!IE)]><!-->
  <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:20px; padding-right: 0px; padding-left: 0px;">
  <!--<![endif]-->
  <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
  <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
  <tbody>
  <tr style="vertical-align: top;" valign="top">
  <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
  </tr>
  </tbody>
  </table>
  </td>
  </tr>
  </tbody>
  </table>
  <table style="" border="0" cellpadding="0" cellspacing="0" align="center" width="640" bgcolor="#FFFFFF"> 
                          <tbody>                  
                          <tr>               
                              <td colspan="4" style="padding:30px 20px 10px;font-size:14px"> 
                                  <div style="font-weight:bold">Dear ${data.fullName},</div> 
                                  <br>                                      
                                  <div>Thanks for your Enquiry.</div>      
                                  <br>                                  
                                  <div style="font-size:16px;font-weight:bold;text-align:center;line-height:30px"> 
                                      <span style="border-bottom:1px solid #ddd;padding-bottom:5px">Enquiry Details</span>  
                                  </div>                       
                                  <br>                          
                                  <div>                  
                                      <table width="100%" cellspacing="0" cellpadding="0" border="0">
                                          <tbody>           
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #ddd;padding:7px 10px">Name:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;border-top:5px solid #999;padding:7px 10px"><strong>${data.fullName}</strong></td> 
                                              </tr> 
  
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Email:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong><a href="mailto:${data.email}" target="_blank">${data.email}</a></strong></td> 
                                              </tr> 
                                              
                        <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Mobile:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.mobile}</strong></td> 
                                              </tr> 
  
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Subject:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.subject}</strong></td> 
                                              </tr>				
                                              <tr>            
                                                  <td width="35%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px">Comments:</td> 
                                                  <td width="65%" align="left" valign="top" style="border-bottom:1px solid #ddd;padding:7px 10px"><strong>${data.message}</strong></td> 
                                              </tr>				
  
                                          </tbody>                                
                                      </table>                            
                                  </div>                              
                                                        
                              </td>              
                          </tr>              
                          <tr>              
                              <td colspan="4" style="padding:20px;font-size:14px"> 
                                  <div style="font-size:14px"> <span>Regards,</span> </div>    
                                  <div style="font-size:14px;padding-top:10px"> <span>Digital Manipur.</span> </div> 
                              </td>                    
                          </tr>                 
                      </tbody></table>
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
`;
}




module.exports.sendMail = (to, from, subject, messageBody, file) => {
  let options;
  // let buff = fs.readFileSync(file.path);
  // let base64data = buff.toString('base64');

  if (file) {
    options = {
      to: [to],
      from,
      subject,
      html: emailTemplate(messageBody),
      attachments: [
        {
          content: file,
          filename: file.originalname,
          type: file.mimetype,
          disposition: 'attachment',
          contentId: 'mytext'
        },
      ]
    };
  } else {
    options = {
      to,
      from,
      subject,
      html: emailTemplate(messageBody),
    };
  }

  console.log({ options });

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      options,
      (error, info) => {
        if (error) {
          console.log({ error });
          reject(error);

        } else {
          console.log('Response : ' + { info });
          console.log(JSON.stringify(info));
          console.log('Email sent: ' + info);
          resolve(info);
        }
      });
  });
}
