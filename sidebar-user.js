/* ═══════════════════════════════════════════════════
   sidebar-user.js — YLG Bullion
   Replaces each page's bottom sidebar auth section
   with a unified name + UID + Logout block.
   ═══════════════════════════════════════════════════ */
(function () {

    function isLoggedIn()    { return !!localStorage.getItem('userEmail'); }
    function getMemberName() { return localStorage.getItem('memberName') || localStorage.getItem('userName') || ''; }
    function getMemberId()   { return localStorage.getItem('memberId') || localStorage.getItem('userShortUID') || '—'; }

    /* ── Build unified bottom block ── */
    function buildBox() {
        var name = getMemberName();
        var mid  = getMemberId();
        return [
            '<div id="sidebar-user-box" style="',
                'padding:14px 16px;',
                'border-top:1px solid rgba(255,255,255,0.08);',
                'margin-top:auto;',
            '">',

            /* ── Logged-in view ── */
            '  <div id="sub-logged-in" style="display:' + (isLoggedIn() ? 'block' : 'none') + '">',

            /* name + UID row */
            '    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">',
            '      <div style="',
                        'width:36px;height:36px;border-radius:50%;',
                        'background:rgba(201,168,76,0.15);',
                        'border:2px solid #C9A84C;',
                        'display:flex;align-items:center;justify-content:center;flex-shrink:0;',
            '      ">',
            '        <i class="fas fa-user" style="color:#C9A84C;font-size:14px;"></i>',
            '      </div>',
            '      <div style="flex:1;min-width:0;">',
            '        <div id="sub-user-name" style="',
                          'font-size:13px;font-weight:700;color:#fff;',
                          'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;line-height:1.3;',
            '        ">' + (name || 'Member') + '</div>',
            '        <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">',
            '          <span style="font-size:10px;color:#666;">UID:</span>',
            '          <span id="sub-uid-text" style="font-size:11px;color:#C9A84C;font-family:monospace;">' + mid + '</span>',
            '          <button id="sub-uid-copy" onclick="copySidebarUID()" title="Copy UID" style="',
                            'background:none;border:none;color:#555;cursor:pointer;',
                            'padding:0;font-size:11px;line-height:1;transition:color 0.2s;',
            '          "><i class="fas fa-copy"></i></button>',
            '        </div>',
            '      </div>',
            '    </div>',

            /* Logout button */
            '    <button onclick="sidebarUserLogout()" style="',
                    'width:100%;padding:9px;',
                    'background:rgba(217,48,37,0.1);',
                    'color:#E05555;',
                    'border:1px solid rgba(217,48,37,0.25);',
                    'border-radius:8px;cursor:pointer;',
                    'font-size:12px;font-weight:600;font-family:inherit;',
                    'transition:background 0.18s;',
            '    ">',
            '      <i class="fas fa-sign-out-alt" style="margin-right:6px;"></i>Logout',
            '    </button>',
            '  </div>',

            /* ── Logged-out view ── */
            '  <div id="sub-logged-out" style="display:' + (!isLoggedIn() ? 'block' : 'none') + '">',
            '    <a href="login.html" style="',
                    'display:block;width:100%;padding:10px;box-sizing:border-box;',
                    'background:var(--color-gold-accent,#C9A84C);color:#000;',
                    'border-radius:8px;text-align:center;text-decoration:none;',
                    'font-weight:700;font-size:13px;margin-bottom:8px;',
            '    "><i class="fas fa-sign-in-alt" style="margin-right:6px;"></i>Login</a>',
            '    <a href="register.html" style="',
                    'display:block;width:100%;padding:10px;box-sizing:border-box;',
                    'background:#252525;color:#aaa;',
                    'border:1px solid #333;border-radius:8px;',
                    'text-align:center;text-decoration:none;font-weight:600;font-size:13px;',
            '    ">Register</a>',
            '  </div>',

            '</div>'
        ].join('');
    }

    /* ── Selectors for existing bottom auth sections to hide ── */
    var OLD_AUTH_SELECTORS = [
        '#dashboard-auth-box',
        '#sidebar-auth',
        '#sidebar-auth-box',
        '.auth-control-box',
        '.side-profile',
    ];

    function hideOldAuth(sidebar) {
        OLD_AUTH_SELECTORS.forEach(function (sel) {
            var el = sidebar.querySelector(sel);
            if (el) el.style.display = 'none';
        });
    }

    /* ── Only show on dashboard ── */
    var page = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var isDash = (page === 'index.html' || page === '');

    /* ── Inject ── */
    function inject() {
        var sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        /* Hide old auth on all pages */
        hideOldAuth(sidebar);
        /* Only inject user box on dashboard */
        if (!isDash || document.getElementById('sidebar-user-box')) return;
        sidebar.insertAdjacentHTML('beforeend', buildBox());
    }

    /* ── Update existing box ── */
    function updateBox() {
        var li  = document.getElementById('sub-logged-in');
        var lo  = document.getElementById('sub-logged-out');
        var nm  = document.getElementById('sub-user-name');
        var uid = document.getElementById('sub-uid-text');
        if (!li) return;
        var on = isLoggedIn();
        li.style.display = on ? 'block' : 'none';
        lo.style.display = on ? 'none'  : 'block';
        if (nm)  nm.textContent  = getMemberName() || 'Member';
        if (uid) uid.textContent = getMemberId();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }

    /* ── Copy UID ── */
    window.copySidebarUID = function () {
        var mid = getMemberId();
        if (!mid || mid === '—') return;
        navigator.clipboard.writeText(mid).catch(function () {});
        var btn = document.getElementById('sub-uid-copy');
        if (btn) {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.color = '#C9A84C';
            setTimeout(function () {
                btn.innerHTML = '<i class="fas fa-copy"></i>';
                btn.style.color = '';
            }, 1200);
        }
    };

    /* ── Logout proxy (calls existing page logout or falls back) ── */
    window.sidebarUserLogout = function () {
        /* Try page-level logout functions */
        var fns = ['logout', 'handleLogout', 'signOutUser'];
        for (var i = 0; i < fns.length; i++) {
            if (typeof window[fns[i]] === 'function') {
                window[fns[i]]();
                return;
            }
        }
        /* Try clicking existing logout buttons */
        var btn = document.getElementById('sidebar-logout-btn') ||
                  document.getElementById('logout-btn') ||
                  document.getElementById('logoutBtn');
        if (btn) { btn.click(); return; }
        /* Fallback */
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
    };

    /* ── Watch localStorage ── */
    var _prev = localStorage.setItem.bind(localStorage);
    localStorage.setItem = function (key, val) {
        _prev(key, val);
        if (['memberId','memberName','userShortUID','userEmail','userName'].indexOf(key) !== -1) {
            updateBox();
        }
    };

    window.addEventListener('storage', function (e) {
        if (['memberId','memberName','userShortUID','userEmail','userName'].indexOf(e.key) !== -1) {
            updateBox();
        }
    });

})();
