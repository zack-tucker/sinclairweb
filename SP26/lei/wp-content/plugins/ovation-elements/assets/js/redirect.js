jQuery(document).ready(function() {

    if (jQuery('#toplevel_page_ovation_elements .wp-submenu-wrap li:last-child a').length) {
        jQuery('#toplevel_page_ovation_elements .wp-submenu-wrap li:last-child a').attr('href', 'https://www.ovationthemes.com/products/ovation-elements-pro');
        jQuery('#toplevel_page_ovation_elements .wp-submenu-wrap li:last-child a').attr('target', '_blank');
    }

    var goProLink = jQuery('#toplevel_page_ovation_elements .wp-submenu-wrap li:last-child a');
    
    if (goProLink.length) {
        if (goProLink.text().toLowerCase() === 'go pro') {
            goProLink.attr('href', 'https://www.ovationthemes.com/products/ovation-elements-pro');
            goProLink.attr('target', '_blank');
        } else if (goProLink.text().toLowerCase() === 'license key') {
            goProLink.attr('href', 'admin.php?page=license-key'); 
            goProLink.attr('target', '_self');  
        }
    }
});
