/* 
 * Copyright (c) 2016 Bruce Schubert - <bruce@emxsys.com>.
 * Released under the MIT License - http://www.opensource.org/licenses/mit-license.php
 */
define(['ojs/ojcore', 'knockout'], function (oj, ko) {
    /**
     * The view model for the footer module.
     * Used to display links on the bottom of the About Box dialog
     */
    function FooterViewModel() {
        var self = this;
        self.footerLinks = ko.observableArray([
            new footerLink('About Emxsys', 'aboutEmxsys', 'http://emxsys.com/about/index.html'),
            new footerLink('Contact Us', 'contactUs', 'http://emxsys.com/contact/index.html'),
            new footerLink('Legal Notices', 'legalNotices', 'http://emxsys.com/policies/index.html'),
            new footerLink('Frequently Asked Questions', 'faqs', 'http://emxsys.com/faqs/index.html'),
        ]);
    }

    function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
    }

    return new FooterViewModel();
});
