// Wi-Fi monitor widget for the homepage hero section.
(function () {
    const monitor = document.querySelector('.wifi-monitor');

    if (!monitor) {
        return;
    }

    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection ||
        null;

    const elements = {
        badge: document.getElementById('wifiStatusBadge'),
        state: document.getElementById('wifiConnectionState'),
        type: document.getElementById('wifiConnectionType'),
        downlink: document.getElementById('wifiDownlink'),
        latency: document.getElementById('wifiLatency'),
        note: document.getElementById('wifiMonitorNote'),
        lastUpdated: document.getElementById('wifiLastUpdated')
    };

    function formatTime() {
        return new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

    function formatConnectionType() {
        if (!connection) {
            return 'Browser limited';
        }

        if (connection.type) {
            return connection.type.replace(/-/g, ' ');
        }

        if (connection.effectiveType) {
            return connection.effectiveType.toUpperCase();
        }

        return 'Unknown';
    }

    function getSignalStrength(isOnline) {
        if (!isOnline) {
            return 0;
        }

        if (!connection) {
            return 2;
        }

        if (typeof connection.downlink === 'number') {
            if (connection.downlink >= 10) {
                return 4;
            }

            if (connection.downlink >= 5) {
                return 3;
            }

            if (connection.downlink >= 1.5) {
                return 2;
            }

            return 1;
        }

        switch (connection.effectiveType) {
            case '4g':
                return 4;
            case '3g':
                return 3;
            case '2g':
                return 2;
            case 'slow-2g':
                return 1;
            default:
                return 2;
        }
    }

    function getConnectionSummary(isOnline) {
        if (!isOnline) {
            return {
                badgeText: 'Offline',
                badgeClass: 'wifi-status-badge wifi-status-badge--offline',
                stateText: 'No internet access',
                noteText: 'The browser reports that the device is currently offline.'
            };
        }

        const strength = getSignalStrength(true);

        if (strength <= 1) {
            return {
                badgeText: 'Weak signal',
                badgeClass: 'wifi-status-badge wifi-status-badge--limited',
                stateText: 'Connected with instability',
                noteText: 'Connection is available, but quality looks weak or slow.'
            };
        }

        return {
            badgeText: 'Online',
            badgeClass: 'wifi-status-badge wifi-status-badge--online',
            stateText: 'Connected',
            noteText: connection
                ? 'Live data is coming from the browser Network Information API.'
                : 'Basic connectivity is available. Detailed Wi-Fi data is limited in this browser.'
        };
    }

    function updateMonitor() {
        const isOnline = navigator.onLine;
        const summary = getConnectionSummary(isOnline);
        const strength = getSignalStrength(isOnline);

        monitor.dataset.connection = isOnline ? 'online' : 'offline';
        monitor.dataset.strength = String(strength);

        elements.badge.textContent = summary.badgeText;
        elements.badge.className = summary.badgeClass;
        elements.state.textContent = summary.stateText;
        elements.type.textContent = formatConnectionType();
        elements.downlink.textContent =
            connection && typeof connection.downlink === 'number'
                ? `${connection.downlink.toFixed(1)} Mbps`
                : 'Unavailable';
        elements.latency.textContent =
            connection && typeof connection.rtt === 'number'
                ? `${connection.rtt} ms`
                : 'Unavailable';
        elements.note.textContent = summary.noteText;
        elements.lastUpdated.textContent = formatTime();
    }

    function notifyStatusChange(isOnline) {
        if (typeof window.showToast !== 'function') {
            return;
        }

        if (isOnline) {
            window.showToast('Internet connection restored', 'success');
            return;
        }

        window.showToast('Internet connection lost', 'warning');
    }

    let lastOnlineState = navigator.onLine;

    window.addEventListener('online', function () {
        updateMonitor();
        if (!lastOnlineState) {
            notifyStatusChange(true);
        }
        lastOnlineState = true;
    });

    window.addEventListener('offline', function () {
        updateMonitor();
        if (lastOnlineState) {
            notifyStatusChange(false);
        }
        lastOnlineState = false;
    });

    if (connection && typeof connection.addEventListener === 'function') {
        connection.addEventListener('change', updateMonitor);
    }

    updateMonitor();
    window.setInterval(updateMonitor, 15000);
})();
