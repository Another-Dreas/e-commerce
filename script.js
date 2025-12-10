



// Close Top Bar and Move Navbar Up
function closeTopBar() {
    const topBar = document.getElementById("topBar");
    const mainNav = document.getElementById("mainNav");
    const main = document.querySelector("main");
    const body = document.body;
    const mobileSearch = document.getElementById("mobileSearch");

    if (topBar) topBar.style.display = "none";
    if (mainNav) mainNav.style.top = "0";

    // Adjust mobile search position if it's open
    if (mobileSearch && !mobileSearch.classList.contains("hidden")) {
        mobileSearch.style.top = "80px"; // Move up when top bar is closed
    }

    // Adjust content padding to account for navbar height (navbar is ~80px tall)
    // Remove all existing padding classes first
    if (main) {
        main.classList.remove("pt-16", "pt-20", "pt-24", "pt-32");
        main.classList.add("pt-20"); // 80px padding for navbar
    }

    // Also handle body padding for pages that might use body padding
    body.classList.remove("pt-16", "pt-20", "pt-24", "pt-32");
    if (!main) {
        body.classList.add("pt-20"); // 80px padding for navbar as fallback
    }
}

// Mobile Menu Toggle
function openMenu() {
    const menu = document.getElementById("mobileMenu");
    if (menu) {
        menu.style.display = menu.style.display === "none" ? "flex" : "none";
        menu.classList.toggle("-translate-x-full");
    }
}

// Close mobile menu when switching to desktop view
window.addEventListener('resize', function() {
    const menu = document.getElementById("mobileMenu");
    if (menu && window.innerWidth >= 768) { // md breakpoint
        menu.classList.add("-translate-x-full");
    }

    // Close mobile filter panel when switching to desktop view
    const filterPanel = document.getElementById("mobileFilterPanel");
    if (filterPanel && window.innerWidth >= 1024) { // lg breakpoint
        closeMobileFilters();
    }
});

// Mobile Search Toggle
function toggleMobileSearch() {
    const search = document.getElementById("mobileSearch");
    const topBar = document.getElementById("topBar");
    const mainNav = document.getElementById("mainNav");
    if (search) {
        search.classList.toggle("hidden");
        if (!search.classList.contains("hidden")) {
            // Calculate position dynamically based on navbar position and height
            if (mainNav) {
                const navTop = mainNav.offsetTop;
                const navHeight = mainNav.offsetHeight;
                search.style.top = (navTop + navHeight) + "px";
            }
            // Focus on input when opened
            const input = search.querySelector("input");
            if (input) input.focus();
        }
    }
}

// Close mobile search when clicking outside
document.addEventListener('click', function(event) {
    const search = document.getElementById("mobileSearch");
    const searchIcon = document.querySelector('i[onclick="toggleMobileSearch()"]');

    if (search && !search.classList.contains("hidden")) {
        if (!search.contains(event.target) && event.target !== searchIcon && !searchIcon.contains(event.target)) {
            search.classList.add("hidden");
        }
    }
});

// Mobile Filter Panel Toggle
function openMobileFilters() {
    const panel = document.getElementById("mobileFilterPanel");
    panel.classList.remove("translate-x-full");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

function closeMobileFilters() {
    const panel = document.getElementById("mobileFilterPanel");
    panel.classList.add("translate-x-full");
    document.body.style.overflow = ""; // Restore scrolling
}

// Filter Synchronization Functions
function saveFilterState() {
    const filterState = {
        colors: [],
        sizes: [],
        styles: [],
        priceRange: { min: 0, max: 10000000 },
        sortBy: 'Most Popular'
    };

    // Get desktop filters
    const colorFilters = document.querySelectorAll('.color-filter');
    filterState.colors = Array.from(colorFilters)
        .filter(filter => filter.classList.contains('selected'))
        .map(filter => filter.dataset.color);

    const sizeFilters = document.querySelectorAll('.size-filter');
    const activeSize = Array.from(sizeFilters).find(f => f.classList.contains('active'));
    if (activeSize) filterState.sizes = [activeSize.dataset.size];

    const styleFilters = document.querySelectorAll('.style-filter');
    filterState.styles = Array.from(styleFilters)
        .filter(filter => filter.classList.contains('selected'))
        .map(filter => filter.dataset.style);

    const minPriceSlider = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPriceInput');
    if (minPriceSlider) filterState.priceRange.min = parseInt(minPriceSlider.value);
    if (maxPriceInput) filterState.priceRange.max = parseInt(maxPriceInput.value);

    const desktopSortBy = document.querySelector('.hidden.md\\:flex select');
    if (desktopSortBy) filterState.sortBy = desktopSortBy.value;

    localStorage.setItem('shopFilters', JSON.stringify(filterState));
}

function loadFilterState() {
    const savedState = localStorage.getItem('shopFilters');
    if (!savedState) return;

    const filterState = JSON.parse(savedState);

    // Apply to desktop filters
    const colorFilters = document.querySelectorAll('.color-filter');
    colorFilters.forEach(filter => {
        if (filterState.colors.includes(filter.dataset.color)) {
            filter.classList.add('selected', 'border-blue-500');
            filter.classList.remove('border-gray-300');
        } else {
            filter.classList.remove('selected', 'border-blue-500');
            filter.classList.add('border-gray-300');
        }
    });

    const sizeFilters = document.querySelectorAll('.size-filter');
    sizeFilters.forEach(filter => {
        if (filterState.sizes.includes(filter.dataset.size)) {
            sizeFilters.forEach(f => f.classList.remove('active', 'bg-black', 'text-white', 'border-black'));
            filter.classList.add('active', 'bg-black', 'text-white', 'border-black');
        }
    });

    const styleFilters = document.querySelectorAll('.style-filter');
    styleFilters.forEach(filter => {
        if (filterState.styles.includes(filter.dataset.style)) {
            filter.classList.add('selected');
        } else {
            filter.classList.remove('selected');
        }
    });

    // Apply price range
    const minPriceSlider = document.getElementById('minPrice');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');
    const minPriceLabel = document.getElementById('minPriceLabel');
    const maxPriceLabel = document.getElementById('maxPriceLabel');

    if (minPriceSlider) minPriceSlider.value = filterState.priceRange.min;
    if (minPriceInput) minPriceInput.value = filterState.priceRange.min;
    if (maxPriceInput) maxPriceInput.value = filterState.priceRange.max;
    if (minPriceLabel) minPriceLabel.textContent = 'Rp ' + filterState.priceRange.min.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (maxPriceLabel) maxPriceLabel.textContent = 'Rp ' + filterState.priceRange.max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Apply to mobile filters
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        if (filterState.colors.includes(swatch.dataset.color)) {
            swatch.classList.add('selected', 'border-blue-500');
            swatch.classList.remove('border-gray-300');
        } else {
            swatch.classList.remove('selected', 'border-blue-500');
            swatch.classList.add('border-gray-300');
        }
    });

    const sizePills = document.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
        if (filterState.sizes.includes(pill.textContent.toLowerCase().replace(' ', '-'))) {
            pill.classList.add('selected', 'bg-black', 'text-white', 'border-black');
            pill.classList.remove('border-gray-300', 'dark:border-gray-600');
        } else {
            pill.classList.remove('selected', 'bg-black', 'text-white', 'border-black');
            pill.classList.add('border-gray-300', 'dark:border-gray-600');
        }
    });

    // Apply mobile price
    const mobileMinPrice = document.getElementById('mobileMinPrice');
    const mobileMinPriceInput = document.getElementById('mobileMinPriceInput');
    const mobileMaxPriceInput = document.getElementById('mobileMaxPriceInput');
    const mobileMinLabel = document.getElementById('mobileMinPriceLabel');
    const mobileMaxLabel = document.getElementById('mobileMaxPriceLabel');

    if (mobileMinPrice) mobileMinPrice.value = filterState.priceRange.min;
    if (mobileMinPriceInput) mobileMinPriceInput.value = filterState.priceRange.min;
    if (mobileMaxPriceInput) mobileMaxPriceInput.value = filterState.priceRange.max;
    if (mobileMinLabel) mobileMinLabel.textContent = 'Rp ' + filterState.priceRange.min.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (mobileMaxLabel) mobileMaxLabel.textContent = 'Rp ' + filterState.priceRange.max.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Apply sort by
    const desktopSortBy = document.querySelector('.hidden.md\\:flex select');
    const mobileSortBy = document.querySelector('#mobileFilterPanel select');
    if (desktopSortBy) desktopSortBy.value = filterState.sortBy;
    if (mobileSortBy) mobileSortBy.value = filterState.sortBy;
}

// Desktop Price Filter Sync
document.addEventListener('DOMContentLoaded', function() {
    // Desktop Price Filter
    const minPriceSlider = document.getElementById('minPrice');
    const minPriceInput = document.getElementById('minPriceInput');
    const maxPriceInput = document.getElementById('maxPriceInput');
    const minPriceLabel = document.getElementById('minPriceLabel');
    const maxPriceLabel = document.getElementById('maxPriceLabel');

    if (minPriceSlider && minPriceInput && maxPriceInput) {
        function updateDesktopPriceLabels() {
            const minVal = parseInt(minPriceSlider.value);
            const maxVal = parseInt(maxPriceInput.value);

            // Ensure min doesn't exceed max
            if (minVal > maxVal) {
                minPriceSlider.value = maxVal;
                minPriceInput.value = maxVal;
            } else {
                minPriceInput.value = minVal;
            }

            minPriceLabel.textContent = 'Rp ' + minPriceSlider.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            maxPriceLabel.textContent = 'Rp ' + maxPriceInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        function syncSliderFromInputs() {
            const minVal = parseInt(minPriceInput.value);
            const maxVal = parseInt(maxPriceInput.value);

            if (minVal > maxVal) {
                minPriceInput.value = maxVal;
            }

            minPriceSlider.value = minPriceInput.value;
            updateDesktopPriceLabels();
        }

        minPriceSlider.addEventListener('input', function() {
            updateDesktopPriceLabels();
            saveFilterState();
        });
        minPriceInput.addEventListener('input', function() {
            syncSliderFromInputs();
            saveFilterState();
        });
        maxPriceInput.addEventListener('input', function() {
            updateDesktopPriceLabels();
            saveFilterState();
        });

        // Initialize labels
        updateDesktopPriceLabels();
    }

    // Desktop Filter Interactions
    const colorFilters = document.querySelectorAll('.color-filter');
    colorFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            if (this.classList.contains('selected')) {
                this.classList.remove('selected', 'border-blue-500');
                this.classList.add('border-gray-300');
            } else {
                this.classList.add('selected', 'border-blue-500');
                this.classList.remove('border-gray-300');
            }
            saveFilterState();
        });
    });

    const sizeFilters = document.querySelectorAll('.size-filter');
    sizeFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            sizeFilters.forEach(f => f.classList.remove('active', 'bg-black', 'text-white', 'border-black'));
            this.classList.add('active', 'bg-black', 'text-white', 'border-black');
            saveFilterState();
        });
    });

    const styleFilters = document.querySelectorAll('.style-filter');
    styleFilters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Toggle or select style
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
            } else {
                this.classList.add('selected');
            }
            saveFilterState();
        });
    });

    const desktopSortBy = document.querySelector('.hidden.md\\:flex select');
    if (desktopSortBy) {
        desktopSortBy.addEventListener('change', function() {
            saveFilterState();
        });
    }

    const applyFilterBtn = document.querySelector('.apply-filter');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function() {
            const selectedColors = Array.from(colorFilters)
                .filter(filter => filter.classList.contains('selected'))
                .map(filter => filter.dataset.color);

            const selectedSizes = Array.from(sizeFilters)
                .filter(filter => filter.classList.contains('active'))
                .map(filter => filter.dataset.size);

            const selectedStyles = Array.from(styleFilters)
                .filter(filter => filter.classList.contains('selected'))
                .map(filter => filter.dataset.style);

            const minPrice = minPriceSlider ? parseInt(minPriceSlider.value) : 0;
            const maxPrice = maxPriceInput ? parseInt(maxPriceInput.value) : 10000000;

            console.log('Desktop filters applied:', {
                colors: selectedColors,
                sizes: selectedSizes,
                styles: selectedStyles,
                priceRange: { min: minPrice, max: maxPrice }
            });

            this.textContent = 'Applied!';
            setTimeout(() => {
                this.textContent = 'Apply Filter';
            }, 2000);
        });
    }

    // Load saved filter state on page load
    loadFilterState();
});

// Mobile Filter Interactions
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Color Swatches
    const colorSwatches = document.querySelectorAll('.color-swatch');
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', function() {
            // Toggle selected state
            if (this.classList.contains('selected')) {
                this.classList.remove('selected', 'border-blue-500');
                this.classList.add('border-gray-300');
            } else {
                this.classList.add('selected', 'border-blue-500');
                this.classList.remove('border-gray-300');
            }
            saveFilterState();
        });
    });

    // Mobile Size Pills
    const sizePills = document.querySelectorAll('.size-pill');
    sizePills.forEach(pill => {
        pill.addEventListener('click', function() {
            // Toggle selected state
            if (this.classList.contains('selected')) {
                this.classList.remove('selected', 'bg-black', 'text-white', 'border-black');
                this.classList.add('border-gray-300', 'dark:border-gray-600');
            } else {
                this.classList.add('selected', 'bg-black', 'text-white', 'border-black');
                this.classList.remove('border-gray-300', 'dark:border-gray-600');
            }
            saveFilterState();
        });
    });

    // Mobile Price Filter Sync
    const mobileMinPrice = document.getElementById('mobileMinPrice');
    const mobileMinPriceInput = document.getElementById('mobileMinPriceInput');
    const mobileMaxPriceInput = document.getElementById('mobileMaxPriceInput');
    const mobileMinLabel = document.getElementById('mobileMinPriceLabel');
    const mobileMaxLabel = document.getElementById('mobileMaxPriceLabel');

    if (mobileMinPrice && mobileMinPriceInput && mobileMaxPriceInput) {
        function updateMobilePriceLabels() {
            const minVal = parseInt(mobileMinPrice.value);
            const maxVal = parseInt(mobileMaxPriceInput.value);

            // Ensure min doesn't exceed max
            if (minVal > maxVal) {
                mobileMinPrice.value = maxVal;
                mobileMinPriceInput.value = maxVal;
            } else {
                mobileMinPriceInput.value = minVal;
            }

            mobileMinLabel.textContent = 'Rp ' + mobileMinPrice.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            mobileMaxLabel.textContent = 'Rp ' + mobileMaxPriceInput.value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        function syncMobileSliderFromInputs() {
            const minVal = parseInt(mobileMinPriceInput.value);
            const maxVal = parseInt(mobileMaxPriceInput.value);

            if (minVal > maxVal) {
                mobileMinPriceInput.value = maxVal;
            }

            mobileMinPrice.value = mobileMinPriceInput.value;
            updateMobilePriceLabels();
        }

        mobileMinPrice.addEventListener('input', function() {
            updateMobilePriceLabels();
            saveFilterState();
        });
        mobileMinPriceInput.addEventListener('input', function() {
            syncMobileSliderFromInputs();
            saveFilterState();
        });
        mobileMaxPriceInput.addEventListener('input', function() {
            updateMobilePriceLabels();
            saveFilterState();
        });

        // Initialize labels
        updateMobilePriceLabels();
    }

    // Mobile Sort By
    const mobileSortBy = document.querySelector('#mobileFilterPanel select');
    if (mobileSortBy) {
        mobileSortBy.addEventListener('change', function() {
            console.log('Mobile sort by changed to:', this.value);
            saveFilterState();
        });
    }

    // Mobile Apply Filter Button
    const applyMobileFilterBtn = document.querySelector('.apply-mobile-filter');
    if (applyMobileFilterBtn) {
        applyMobileFilterBtn.addEventListener('click', function() {
            // Get selected mobile filters
            const selectedColors = Array.from(colorSwatches)
                .filter(swatch => swatch.classList.contains('selected'))
                .map(swatch => swatch.dataset.color);

            const selectedSizes = Array.from(sizePills)
                .filter(pill => pill.classList.contains('selected'))
                .map(pill => pill.textContent);

            const minPrice = mobileMinPrice ? parseInt(mobileMinPrice.value) : 50;
            const maxPrice = mobileMaxPrice ? parseInt(mobileMaxPrice.value) : 200;

            const sortBy = mobileSortBy ? mobileSortBy.value : 'Most Popular';

            console.log('Mobile filters applied:', {
                colors: selectedColors,
                sizes: selectedSizes,
                priceRange: { min: minPrice, max: maxPrice },
                sortBy: sortBy
            });

            // Close panel and show feedback
            closeMobileFilters();
            this.textContent = 'Applied!';
            setTimeout(() => {
                this.textContent = 'Apply Filter';
            }, 2000);
        });
    }

    // Close panel when clicking outside (optional)
    document.addEventListener('click', function(event) {
        const panel = document.getElementById('mobileFilterPanel');
        const filterBtn = document.querySelector('button[onclick="openMobileFilters()"]');

        if (!panel.contains(event.target) && event.target !== filterBtn && !filterBtn.contains(event.target)) {
            if (!panel.classList.contains('translate-x-full')) {
                closeMobileFilters();
            }
        }
    });
});

function initNavbarScroll() {
    const topBar = document.getElementById("topBar");
    const mainNav = document.getElementById("mainNav");
    const main = document.querySelector("main");
    const body = document.body;

    if (!mainNav) return; // jika navbar belum ada di DOM, hentikan

    function adjustPadding() {
        if (topBar && topBar.style.display !== "none") {
            // Top bar masih terlihat, tambahkan jarak ekstra agar tidak tumpang tindih
            const totalHeight = topBar.offsetHeight + mainNav.offsetHeight + 16; // tambah 16px jarak
            const paddingClass = getPaddingClass(totalHeight);
            if (main) {
                main.classList.remove("pt-16", "pt-20", "pt-24", "pt-28", "pt-32", "pt-36", "pt-40");
                main.classList.add(paddingClass);
            }
            body.classList.remove("pt-16", "pt-20", "pt-24", "pt-28", "pt-32", "pt-36", "pt-40");
            if (!main) {
                body.classList.add(paddingClass);
            }
        } else {
            // Top bar sudah ditutup, padding tepat untuk navbar tanpa space kosong
            const navHeight = mainNav.offsetHeight;
            const paddingClass = getPaddingClass(navHeight);
            if (main) {
                main.classList.remove("pt-16", "pt-20", "pt-24", "pt-28", "pt-32", "pt-36", "pt-40");
                main.classList.add(paddingClass);
            }
            body.classList.remove("pt-16", "pt-20", "pt-24", "pt-28", "pt-32", "pt-36", "pt-40");
            if (!main) {
                body.classList.add(paddingClass);
            }
        }
    }

    function getPaddingClass(height) {
        if (height <= 64) return "pt-16"; // 64px
        if (height <= 80) return "pt-20"; // 80px
        if (height <= 96) return "pt-24"; // 96px
        if (height <= 112) return "pt-28"; // 112px
        if (height <= 128) return "pt-32"; // 128px
        if (height <= 144) return "pt-36"; // 144px
        return "pt-40"; // 160px
    }

    // Adjust on load
    adjustPadding();

    window.addEventListener("scroll", () => {
        let y = window.scrollY;

        if (topBar && topBar.style.display !== "none") {
            // Top bar masih terlihat, tetap muncul saat scroll, navbar tetap di top-8
            topBar.classList.remove("topbar-hidden");
            mainNav.classList.remove("nav-fixed");
        } else {
            // Top bar sudah ditutup, navbar naik ke atas (top 0)
            mainNav.classList.add("nav-fixed");
        }
        adjustPadding();
    });
}

/* =====================
   Auth simulation using localStorage (demo only)
   - Stores registered users in localStorage under 'ecom_users'
   - Saves current logged user under 'ecom_current_user'
   - Provides client-side validation and feedback
   NOTE: This is a demo implementation. Do NOT use in production.
   ===================== */
document.addEventListener('DOMContentLoaded', function() {
    function showMessage(container, text, type) {
        if (!container) return;
        container.textContent = text;
        container.classList.remove('error', 'success');
        container.classList.add(type || 'error');
        container.style.display = 'block';
    }
    function clearMessage(container) {
        if (!container) return;
        container.textContent = '';
        container.style.display = 'none';
        container.classList.remove('error', 'success');
    }

    function getUsers() {
        try {
            const raw = localStorage.getItem('ecom_users');
            return raw ? JSON.parse(raw) : [];
        } catch (e) { return []; }
    }
    function saveUsers(users) {
        localStorage.setItem('ecom_users', JSON.stringify(users));
    }
    function findUserByEmail(email) {
        if (!email) return null;
        const users = getUsers();
        return users.find(u => (u.email || '').toLowerCase() === email.toLowerCase()) || null;
    }
    function saveCurrentUser(user) {
        if (!user) { localStorage.removeItem('ecom_current_user'); return; }
        localStorage.setItem('ecom_current_user', JSON.stringify({ email: user.email, fullname: user.fullname }));
    }

    function validateEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

    // Login
    const loginTitle = document.getElementById('login-title');
    if (loginTitle) {
        const loginCard = loginTitle.closest('.auth-card');
        const loginForm = loginCard ? loginCard.querySelector('form.auth-form') : null;
        const msg = loginCard ? loginCard.querySelector('.form-message') : null;
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                clearMessage(msg);
                const emailInput = loginForm.querySelector('input[type="email"]');
                const passInput = loginForm.querySelector('input[type="password"]');
                const email = emailInput ? emailInput.value.trim() : '';
                const pass = passInput ? passInput.value : '';

                if (!email || !validateEmail(email)) { showMessage(msg, 'Masukkan email yang valid.', 'error'); emailInput && emailInput.focus(); return; }
                if (!pass) { showMessage(msg, 'Masukkan password Anda.', 'error'); passInput && passInput.focus(); return; }

                const user = findUserByEmail(email);
                if (!user) { showMessage(msg, 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.', 'error'); return; }
                if (user.password !== pass) { showMessage(msg, 'Password salah. Coba lagi.', 'error'); passInput && passInput.focus(); return; }

                // success
                saveCurrentUser(user);
                showMessage(msg, 'Berhasil masuk. Mengarahkan...', 'success');
                setTimeout(() => { window.location.href = '../index.html'; }, 800);
            });
        }
    }

    // Register
    const registerTitle = document.getElementById('register-title');
    if (registerTitle) {
        const regCard = registerTitle.closest('.auth-card');
        const registerForm = regCard ? regCard.querySelector('form.auth-form') : null;
        const msg = regCard ? regCard.querySelector('.form-message') : null;
        if (registerForm) {
            const fullname = registerForm.querySelector('#fullname');
            const email = registerForm.querySelector('#email');
            const password = registerForm.querySelector('#password');
            const confirm = registerForm.querySelector('#confirm_password');
            const pwNote = registerForm.querySelector('.pw-note');

            function checkPwMatch() {
                if (!password || !confirm) return;
                if (!confirm.value) { confirm.classList.remove('input-error'); pwNote && (pwNote.style.display = 'none'); return; }
                if (password.value !== confirm.value) { confirm.classList.add('input-error'); pwNote && (pwNote.style.display = 'block'); }
                else { confirm.classList.remove('input-error'); pwNote && (pwNote.style.display = 'none'); }
            }
            if (password && confirm) { password.addEventListener('input', checkPwMatch); confirm.addEventListener('input', checkPwMatch); }

            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                clearMessage(msg);

                const nameVal = fullname ? fullname.value.trim() : '';
                const emailVal = email ? email.value.trim() : '';
                const passVal = password ? password.value : '';
                const confVal = confirm ? confirm.value : '';

                if (!nameVal) { showMessage(msg, 'Nama lengkap wajib diisi.', 'error'); fullname && fullname.focus(); return; }
                if (!emailVal || !validateEmail(emailVal)) { showMessage(msg, 'Masukkan email yang valid.', 'error'); email && email.focus(); return; }
                if (!passVal || passVal.length < 6) { showMessage(msg, 'Password minimal 6 karakter.', 'error'); password && password.focus(); return; }
                if (passVal !== confVal) { showMessage(msg, 'Password dan konfirmasi tidak cocok.', 'error'); confirm && confirm.focus(); return; }

                // check existing
                if (findUserByEmail(emailVal)) { showMessage(msg, 'Email sudah terdaftar. Silakan login.', 'error'); return; }

                // save new user (demo): store plaintext password (NOT for production)
                const users = getUsers();
                users.push({ fullname: nameVal, email: emailVal, password: passVal });
                saveUsers(users);

                showMessage(msg, 'Pendaftaran sukses. Mengarahkan ke halaman login...', 'success');
                setTimeout(() => { window.location.href = 'login.html'; }, 900);
            });
        }
    }

    /* =====================
       Toggle Filter Submenus (Desktop & Mobile)
       ===================== */
    function toggleFilterCategory(id) {
        const submenu = document.getElementById(`submenu-${id}`);
        const icon = document.getElementById(`icon-${id}`);
        if (!submenu || !icon) return;

        if (submenu.classList.contains('hidden')) {
            submenu.classList.remove('hidden');
            icon.classList.add('rotate-180'); // untuk animasi ikon
        } else {
            submenu.classList.add('hidden');
            icon.classList.remove('rotate-180');
        }
    }

    // Attach toggle event ke semua tombol kategori
    document.querySelectorAll('.category-item button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Ambil data-id dari button atau fallback ke id
            const id = this.dataset.id || this.getAttribute('data-id') || this.querySelector('i').id.split('icon-')[1];
            toggleFilterCategory(id);
        });
    });

    /* =====================
       Mobile Filter Panel Open / Close
       ===================== */
    const mobileFilterPanel = document.getElementById('mobileFilterPanel');

    window.openMobileFilters = function() {
        if (mobileFilterPanel) {
            mobileFilterPanel.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden';
        }
    }

    window.closeMobileFilters = function() {
        if (mobileFilterPanel) {
            mobileFilterPanel.classList.add('translate-x-full');
            document.body.style.overflow = '';
        }
    }

    /* =====================
       Example: Apply Filters Button (Mobile)
       ===================== */
    const applyMobileFilterBtn = document.querySelector('.apply-mobile-filter');
    if (applyMobileFilterBtn) {
        applyMobileFilterBtn.addEventListener('click', function() {
            // Ambil filter kategori yang terbuka
            const openCategories = Array.from(document.querySelectorAll('.category-item .hidden:not(.hidden)'));
            console.log('Open categories:', openCategories);

            // Bisa ambil pilihan warna, ukuran, harga, dll di sini

            closeMobileFilters();
            this.textContent = 'Applied!';
            setTimeout(() => { this.textContent = 'Apply Filter'; }, 2000);
        });
    }

    /* =====================
       Optional: Sync filter state desktop & mobile
       ===================== */
    // Misal, warna, ukuran, harga bisa diambil dari desktop & mobile
    // dan disimpan di localStorage seperti yang sudah kamu buat


});
