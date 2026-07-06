/**
 * 个人网站 - 交互脚本
 */

(function () {
    'use strict';

    // ============ DOM 引用 ============
    var navbar = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');
    var navLinks = document.querySelectorAll('.nav-link');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');
    var contactForm = document.getElementById('contactForm');

    // ============ 导航栏滚动阴影 + active 状态 ============
    function onScroll() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        var sections = document.querySelectorAll('section[id]');
        var current = '';
        sections.forEach(function (section) {
            var top = section.offsetTop - 100;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ============ 移动端汉堡菜单 ============
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    document.addEventListener('click', function (e) {
        if (navMenu.classList.contains('active') &&
            !navMenu.contains(e.target) &&
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ============ 案例轮播 ============
    function initCarousels() {
        var carousels = document.querySelectorAll('.case-carousel');

        carousels.forEach(function (carousel) {
            var track = carousel.querySelector('.carousel-track');
            var slides = carousel.querySelectorAll('.carousel-slide');
            var dots = carousel.querySelectorAll('.carousel-dot');
            var prevBtn = carousel.querySelector('.carousel-prev');
            var nextBtn = carousel.querySelector('.carousel-next');
            var currentIndex = 0;
            var slideCount = slides.length;

            function goTo(index) {
                if (index < 0) index = slideCount - 1;
                if (index >= slideCount) index = 0;
                currentIndex = index;
                track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
                dots.forEach(function (dot, i) {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }

            prevBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                goTo(currentIndex - 1);
            });

            nextBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                goTo(currentIndex + 1);
            });

            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function (e) {
                    e.stopPropagation();
                    goTo(i);
                });
            });

            // 点击图片区域打开 lightbox 查看当前图
            carousel.addEventListener('click', function () {
                var currentSlide = slides[currentIndex];
                var img = currentSlide.querySelector('img');
                var src = '';
                if (img && img.style.display !== 'none') {
                    src = img.getAttribute('src');
                }
                // 图片加载失败时取 onerror 生成的占位内容中的提示
                if (!src || img.style.display === 'none') {
                    src = '';
                }
                if (src) {
                    lightboxImg.setAttribute('src', src);
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });

            // 触摸滑动支持
            var touchStartX = 0;
            var touchEndX = 0;

            carousel.addEventListener('touchstart', function (e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', function (e) {
                touchEndX = e.changedTouches[0].screenX;
                var diff = touchStartX - touchEndX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        goTo(currentIndex + 1);
                    } else {
                        goTo(currentIndex - 1);
                    }
                }
            });
        });
    }

    initCarousels();

    // ============ Lightbox 控制 ============
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(function () {
            lightboxImg.setAttribute('src', '');
        }, 300);
    }

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // ============ 联系表单 ============
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('name').value.trim();
            var email = document.getElementById('email').value.trim();
            var message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('请填写所有字段');
                return;
            }

            var btn = contactForm.querySelector('.btn-submit');
            var originalText = btn.textContent;
            btn.textContent = '发送中...';
            btn.disabled = true;

            setTimeout(function () {
                alert('消息已发送！感谢你的联系，我会尽快回复。');
                contactForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            }, 800);
        });
    }

    // ============ 初始调用 ============
    onScroll();

})();
