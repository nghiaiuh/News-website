$(document).ready(function() {
    // Hiện nút khi cuộn xuống quá 300px
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
        $('#scrollToTop').addClass('show');
        } else {
        $('#scrollToTop').removeClass('show');
        }
    });

    // Click để cuộn mượt lên đầu trang
    $('#scrollToTop').click(function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, 100)
    });
});