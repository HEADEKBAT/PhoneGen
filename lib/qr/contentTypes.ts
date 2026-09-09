/**
 * QR Studio — Content type definitions.
 *
 * 37+ content types with smart forms, encoding logic, and validation.
 * Each type defines its form fields, how to encode data into a QR string,
 * and how to validate input data.
 */

import type { QRContentType, QRContentTypeConfig } from './types';

/* ── Helper ──────────────────────────────────────────────────────────── */

function valid(): { valid: true; errors: [] } {
  return { valid: true, errors: [] };
}

function invalid(field: string, message: string): { valid: false; errors: { field: string; message: string }[] } {
  return { valid: false, errors: [{ field, message }] };
}

/* ── Content type registry ──────────────────────────────────────────── */

export const QR_CONTENT_TYPES: Record<QRContentType, QRContentTypeConfig> = {
  /* ════════ URL & Text ════════ */
  url: {
    id: 'url',
    label: 'URL / Link',
    icon: 'Link',
    category: 'url',
    fields: [
      { id: 'url', label: 'URL', type: 'url', placeholder: 'https://example.com', required: true, validation: { pattern: '^https?://', message: 'Must start with http:// or https://' } },
      { id: 'title', label: 'Title', type: 'text', placeholder: 'Page title (optional)' },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Short description (optional)' },
    ],
    encode: (d) => d.url,
    validate: (d) => d.url ? valid() : invalid('url', 'URL is required'),
  },
  text: {
    id: 'text',
    label: 'Plain Text',
    icon: 'FileText',
    category: 'text',
    fields: [
      { id: 'text', label: 'Text', type: 'textarea', placeholder: 'Enter text to encode in QR', required: true },
    ],
    encode: (d) => d.text,
    validate: (d) => d.text ? valid() : invalid('text', 'Text is required'),
  },

  /* ════════ Communication ════════ */
  email: {
    id: 'email',
    label: 'Email',
    icon: 'Mail',
    category: 'contact',
    fields: [
      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'user@example.com', required: true },
      { id: 'subject', label: 'Subject', type: 'text', placeholder: 'Email subject (optional)' },
      { id: 'body', label: 'Body', type: 'textarea', placeholder: 'Email body (optional)' },
    ],
    encode: (d) => {
      let s = `mailto:${d.email}`;
      if (d.subject || d.body) {
        const params = new URLSearchParams();
        if (d.subject) params.set('subject', d.subject);
        if (d.body) params.set('body', d.body);
        s += '?' + params.toString();
      }
      return s;
    },
    validate: (d) => d.email?.includes('@') ? valid() : invalid('email', 'Enter a valid email address'),
  },
  phone: {
    id: 'phone',
    label: 'Phone',
    icon: 'Phone',
    category: 'contact',
    fields: [
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: true },
    ],
    encode: (d) => `tel:${d.phone.replace(/[^+0-9]/g, '')}`,
    validate: (d) => d.phone?.length >= 5 ? valid() : invalid('phone', 'Enter a valid phone number'),
  },
  sms: {
    id: 'sms',
    label: 'SMS',
    icon: 'MessageSquare',
    category: 'contact',
    fields: [
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: true },
      { id: 'message', label: 'Message', type: 'textarea', placeholder: 'SMS text (optional)' },
    ],
    encode: (d) => {
      let s = `sms:${d.phone.replace(/[^+0-9]/g, '')}`;
      if (d.message) s += `?body=${encodeURIComponent(d.message)}`;
      return s;
    },
    validate: (d) => d.phone?.length >= 5 ? valid() : invalid('phone', 'Enter a valid phone number'),
  },

  /* ════════ Messaging ════════ */
  whatsapp: {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'MessageCircle',
    category: 'social',
    fields: [
      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1234567890', required: true },
      { id: 'message', label: 'Pre-filled Message', type: 'textarea', placeholder: 'Message text (optional)' },
    ],
    encode: (d) => {
      const phone = d.phone.replace(/[^0-9]/g, '');
      let s = `https://wa.me/${phone}`;
      if (d.message) s += `?text=${encodeURIComponent(d.message)}`;
      return s;
    },
    validate: (d) => d.phone?.replace(/[^0-9]/g, '').length >= 7 ? valid() : invalid('phone', 'Enter a valid phone number with country code'),
  },
  telegram: {
    id: 'telegram',
    label: 'Telegram',
    icon: 'Send',
    category: 'social',
    fields: [
      { id: 'username', label: 'Username or Phone', type: 'text', placeholder: '@username or phone', required: true },
      { id: 'message', label: 'Start Message', type: 'text', placeholder: 'Message text (optional)' },
    ],
    encode: (d) => {
      const target = d.username.startsWith('@') ? d.username.slice(1) : d.username;
      let s = `https://t.me/${target}`;
      if (d.message) s += `?start=${encodeURIComponent(d.message)}`;
      return s;
    },
    validate: (d) => d.username ? valid() : invalid('username', 'Username or phone is required'),
  },
  discord: {
    id: 'discord',
    label: 'Discord',
    icon: 'MessageCircle',
    category: 'social',
    fields: [
      { id: 'invite', label: 'Invite Code', type: 'text', placeholder: 'e.g. discord.gg/your-server', required: true },
    ],
    encode: (d) => d.invite.startsWith('http') ? d.invite : `https://discord.gg/${d.invite}`,
    validate: (d) => d.invite ? valid() : invalid('invite', 'Invite code is required'),
  },
  skype: {
    id: 'skype',
    label: 'Skype',
    icon: 'Video',
    category: 'social',
    fields: [
      { id: 'username', label: 'Skype Username', type: 'text', placeholder: 'live:username', required: true },
      { id: 'action', label: 'Action', type: 'select', defaultValue: 'call', options: [{ label: 'Call', value: 'call' }, { label: 'Chat', value: 'chat' }] },
    ],
    encode: (d) => `skype:${d.username}?${d.action || 'call'}`,
    validate: (d) => d.username ? valid() : invalid('username', 'Username is required'),
  },
  facetime: {
    id: 'facetime',
    label: 'FaceTime',
    icon: 'Video',
    category: 'contact',
    fields: [
      { id: 'contact', label: 'Email or Phone', type: 'text', placeholder: 'user@example.com or +1234567890', required: true },
    ],
    encode: (d) => {
      const c = d.contact;
      return c.includes('@') ? `facetime:${c}` : `facetime:${c.replace(/[^+0-9]/g, '')}`;
    },
    validate: (d) => d.contact ? valid() : invalid('contact', 'Email or phone is required'),
  },

  /* ════════ Network ════════ */
  wifi: {
    id: 'wifi',
    label: 'Wi-Fi',
    icon: 'Wifi',
    category: 'network',
    fields: [
      { id: 'ssid', label: 'SSID (Network Name)', type: 'text', placeholder: 'My Wi-Fi Network', required: true },
      { id: 'password', label: 'Password', type: 'password', placeholder: 'Wi-Fi password' },
      { id: 'encryption', label: 'Encryption', type: 'select', defaultValue: 'WPA2', options: [
        { label: 'WPA2-PSK', value: 'WPA' },
        { label: 'WPA2-Enterprise', value: 'WPA2-EAP' },
        { label: 'WEP', value: 'WEP' },
        { label: 'None (Open)', value: 'nopass' },
      ]},
      { id: 'hidden', label: 'Hidden Network', type: 'switch', defaultValue: 'false' },
    ],
    encode: (d) => {
      const enc = d.encryption || 'nopass';
      const hidden = d.hidden === 'true' ? 'true' : 'false';
      if (enc === 'nopass') return `WIFI:T:nopass;S:${d.ssid};H:${hidden};;`;
      return `WIFI:T:${enc};S:${d.ssid};P:${d.password || ''};H:${hidden};;`;
    },
    validate: (d) => d.ssid ? valid() : invalid('ssid', 'SSID is required'),
  },
  vcard: {
    id: 'vcard',
    label: 'vCard / Contact',
    icon: 'Contact',
    category: 'contact',
    fields: [
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'John', required: true },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Doe' },
      { id: 'company', label: 'Company', type: 'text', placeholder: 'Company name' },
      { id: 'phone', label: 'Phone', type: 'tel', placeholder: '+1234567890' },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'john@example.com' },
      { id: 'website', label: 'Website', type: 'url', placeholder: 'https://example.com' },
      { id: 'address', label: 'Address', type: 'text', placeholder: '123 Street, City' },
      { id: 'photoUrl', label: 'Photo URL', type: 'url', placeholder: 'https://example.com/photo.jpg' },
    ],
    encode: (d) => {
      const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];
      const name = `${d.lastName || ''};${d.firstName};`;
      lines.push(`FN:${d.firstName} ${d.lastName || ''}`.trim());
      lines.push(`N:${name}`);
      if (d.company) lines.push(`ORG:${d.company}`);
      if (d.phone) lines.push(`TEL:${d.phone}`);
      if (d.email) lines.push(`EMAIL:${d.email}`);
      if (d.website) lines.push(`URL:${d.website}`);
      if (d.address) lines.push(`ADR:;;${d.address};;;`);
      if (d.photoUrl) lines.push(`PHOTO;VALUE=URI:${d.photoUrl}`);
      lines.push('END:VCARD');
      return lines.join('\n');
    },
    validate: (d) => d.firstName ? valid() : invalid('firstName', 'First name is required'),
  },

  /* ════════ Location ════════ */
  location: {
    id: 'location',
    label: 'GPS Location',
    icon: 'MapPin',
    category: 'location',
    fields: [
      { id: 'latitude', label: 'Latitude', type: 'text', placeholder: '48.8566', required: true },
      { id: 'longitude', label: 'Longitude', type: 'text', placeholder: '2.3522', required: true },
    ],
    encode: (d) => `geo:${d.latitude},${d.longitude}`,
    validate: (d) => {
      if (!d.latitude) return invalid('latitude', 'Latitude is required');
      if (!d.longitude) return invalid('longitude', 'Longitude is required');
      const lat = parseFloat(d.latitude);
      const lng = parseFloat(d.longitude);
      if (isNaN(lat) || lat < -90 || lat > 90) return invalid('latitude', 'Latitude must be between -90 and 90');
      if (isNaN(lng) || lng < -180 || lng > 180) return invalid('longitude', 'Longitude must be between -180 and 180');
      return valid();
    },
  },
  'google-maps': {
    id: 'google-maps',
    label: 'Google Maps',
    icon: 'Map',
    category: 'location',
    fields: [
      { id: 'query', label: 'Search Query or Coordinates', type: 'text', placeholder: 'Eiffel Tower, Paris or 48.8566,2.3522', required: true },
    ],
    encode: (d) => `https://www.google.com/maps?q=${encodeURIComponent(d.query)}`,
    validate: (d) => d.query ? valid() : invalid('query', 'Search query is required'),
  },
  calendar: {
    id: 'calendar',
    label: 'Calendar Event',
    icon: 'Calendar',
    category: 'text',
    fields: [
      { id: 'title', label: 'Event Title', type: 'text', placeholder: 'Meeting', required: true },
      { id: 'description', label: 'Description', type: 'textarea', placeholder: 'Event description' },
      { id: 'location', label: 'Location', type: 'text', placeholder: 'Conference Room A' },
      { id: 'start', label: 'Start Date/Time', type: 'text', placeholder: 'YYYYMMDDTHHMMSS', required: true },
      { id: 'end', label: 'End Date/Time', type: 'text', placeholder: 'YYYYMMDDTHHMMSS', required: true },
    ],
    encode: (d) => {
      const lines: string[] = [
        'BEGIN:VEVENT',
        `SUMMARY:${d.title}`,
        `DTSTART:${d.start.replace(/[-:]/g, '')}`,
        `DTEND:${d.end.replace(/[-:]/g, '')}`,
      ];
      if (d.description) lines.push(`DESCRIPTION:${d.description}`);
      if (d.location) lines.push(`LOCATION:${d.location}`);
      lines.push('END:VEVENT');
      return lines.join('\n');
    },
    validate: (d) => d.title ? valid() : invalid('title', 'Event title is required'),
  },

  /* ════════ Cryptocurrency ════════ */
  bitcoin: {
    id: 'bitcoin',
    label: 'Bitcoin',
    icon: 'Bitcoin',
    category: 'crypto',
    fields: [
      { id: 'address', label: 'Bitcoin Address', type: 'text', placeholder: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', required: true },
      { id: 'amount', label: 'Amount (BTC)', type: 'text', placeholder: '0.01' },
      { id: 'label', label: 'Label', type: 'text', placeholder: 'Payment label (optional)' },
      { id: 'message', label: 'Message', type: 'text', placeholder: 'Payment message (optional)' },
    ],
    encode: (d) => {
      let s = `bitcoin:${d.address}`;
      const params = new URLSearchParams();
      if (d.amount) params.set('amount', d.amount);
      if (d.label) params.set('label', d.label);
      if (d.message) params.set('message', d.message);
      const qs = params.toString();
      if (qs) s += '?' + qs;
      return s;
    },
    validate: (d) => d.address ? valid() : invalid('address', 'Bitcoin address is required'),
  },
  ethereum: {
    id: 'ethereum',
    label: 'Ethereum',
    icon: 'Coins',
    category: 'crypto',
    fields: [
      { id: 'address', label: 'Ethereum Address', type: 'text', placeholder: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18', required: true },
      { id: 'amount', label: 'Amount (ETH)', type: 'text', placeholder: '0.1' },
    ],
    encode: (d) => {
      let s = `ethereum:${d.address}`;
      if (d.amount) s += `?value=${parseFloat(d.amount) * 1e18}e18`;
      return s;
    },
    validate: (d) => d.address ? valid() : invalid('address', 'Ethereum address is required'),
  },
  litecoin: {
    id: 'litecoin',
    label: 'Litecoin',
    icon: 'Coins',
    category: 'crypto',
    fields: [
      { id: 'address', label: 'Litecoin Address', type: 'text', placeholder: 'LTC address', required: true },
      { id: 'amount', label: 'Amount (LTC)', type: 'text', placeholder: '1.0' },
    ],
    encode: (d) => {
      let s = `litecoin:${d.address}`;
      if (d.amount) s += `?amount=${d.amount}`;
      return s;
    },
    validate: (d) => d.address ? valid() : invalid('address', 'Litecoin address is required'),
  },
  monero: {
    id: 'monero',
    label: 'Monero',
    icon: 'Coins',
    category: 'crypto',
    fields: [
      { id: 'address', label: 'Monero Address', type: 'text', placeholder: '4...', required: true },
      { id: 'amount', label: 'Amount (XMR)', type: 'text', placeholder: '0.5' },
      { id: 'paymentId', label: 'Payment ID', type: 'text', placeholder: '(optional)' },
    ],
    encode: (d) => {
      let s = `monero:${d.address}`;
      const params = new URLSearchParams();
      if (d.amount) params.set('amount', d.amount);
      if (d.paymentId) params.set('payment_id', d.paymentId);
      const qs = params.toString();
      if (qs) s += '?' + qs;
      return s;
    },
    validate: (d) => d.address ? valid() : invalid('address', 'Monero address is required'),
  },

  /* ════════ Payment ════════ */
  paypal: {
    id: 'paypal',
    label: 'PayPal',
    icon: 'CreditCard',
    category: 'payment',
    fields: [
      { id: 'paypalId', label: 'PayPal Email or Merchant ID', type: 'text', placeholder: 'merchant@example.com', required: true },
      { id: 'amount', label: 'Amount', type: 'text', placeholder: '10.00' },
      { id: 'currency', label: 'Currency', type: 'text', placeholder: 'USD', defaultValue: 'USD' },
      { id: 'description', label: 'Description', type: 'text', placeholder: 'Payment for...' },
    ],
    encode: (d) => {
      let url = `https://www.paypal.com/paypalme/${d.paypalId}`;
      if (d.amount) url += `/${d.amount}`;
      return url;
    },
    validate: (d) => d.paypalId ? valid() : invalid('paypalId', 'PayPal ID is required'),
  },
  upi: {
    id: 'upi',
    label: 'UPI Payment',
    icon: 'CreditCard',
    category: 'payment',
    fields: [
      { id: 'upiId', label: 'UPI ID', type: 'text', placeholder: 'user@upi', required: true },
      { id: 'name', label: 'Payee Name', type: 'text', placeholder: 'John Doe' },
      { id: 'amount', label: 'Amount', type: 'text', placeholder: '100.00' },
    ],
    encode: (d) => {
      const params = new URLSearchParams({ pa: d.upiId, pn: d.name || '', tn: 'Payment' });
      if (d.amount) params.set('am', d.amount);
      params.set('cu', 'INR');
      return `upi://pay?${params.toString()}`;
    },
    validate: (d) => d.upiId?.includes('@') ? valid() : invalid('upiId', 'Enter a valid UPI ID (e.g., user@upi)'),
  },
  sepa: {
    id: 'sepa',
    label: 'SEPA Payment',
    icon: 'Landmark',
    category: 'payment',
    fields: [
      { id: 'iban', label: 'IBAN', type: 'text', placeholder: 'DE89370400440532013000', required: true },
      { id: 'bic', label: 'BIC', type: 'text', placeholder: 'COBADEFFXXX' },
      { id: 'name', label: 'Beneficiary Name', type: 'text', placeholder: 'John Doe', required: true },
      { id: 'amount', label: 'Amount (EUR)', type: 'text', placeholder: '100.00' },
      { id: 'reference', label: 'Reference', type: 'text', placeholder: 'Invoice #123' },
    ],
    encode: (d) => {
      const lines = ['BCD', '001', '1', 'SCT', '', d.bic || '', d.name, d.iban, '', '', d.amount || '', '', d.reference || ''];
      return lines.join('\n');
    },
    validate: (d) => {
      if (!d.iban) return invalid('iban', 'IBAN is required');
      if (!d.name) return invalid('name', 'Beneficiary name is required');
      return valid();
    },
  },

  /* ════════ App Stores ════════ */
  'app-store': {
    id: 'app-store',
    label: 'App Store',
    icon: 'Smartphone',
    category: 'app',
    fields: [
      { id: 'appId', label: 'App ID', type: 'text', placeholder: 'com.example.app', required: true },
      { id: 'country', label: 'Country Code', type: 'text', placeholder: 'us', defaultValue: 'us' },
    ],
    encode: (d) => `https://apps.apple.com/${d.country || 'us'}/app/${d.appId}`,
    validate: (d) => d.appId ? valid() : invalid('appId', 'App ID is required'),
  },
  'google-play': {
    id: 'google-play',
    label: 'Google Play',
    icon: 'Play',
    category: 'app',
    fields: [
      { id: 'packageName', label: 'Package Name', type: 'text', placeholder: 'com.example.app', required: true },
    ],
    encode: (d) => `https://play.google.com/store/apps/details?id=${d.packageName}`,
    validate: (d) => d.packageName ? valid() : invalid('packageName', 'Package name is required'),
  },

  /* ════════ Meetings ════════ */
  zoom: {
    id: 'zoom',
    label: 'Zoom Meeting',
    icon: 'Video',
    category: 'app',
    fields: [
      { id: 'meetingId', label: 'Meeting ID', type: 'text', placeholder: '123 456 7890', required: true },
      { id: 'password', label: 'Passcode', type: 'text', placeholder: 'Meeting passcode (optional)' },
    ],
    encode: (d) => {
      const id = d.meetingId.replace(/\s/g, '');
      let s = `https://zoom.us/j/${id}`;
      if (d.password) s += `?pwd=${d.password}`;
      return s;
    },
    validate: (d) => d.meetingId ? valid() : invalid('meetingId', 'Meeting ID is required'),
  },
  teams: {
    id: 'teams',
    label: 'Microsoft Teams',
    icon: 'Video',
    category: 'app',
    fields: [
      { id: 'meetingUrl', label: 'Meeting URL or ID', type: 'text', placeholder: 'https://teams.microsoft.com/...', required: true },
    ],
    encode: (d) => d.meetingUrl.startsWith('http') ? d.meetingUrl : `https://teams.microsoft.com/l/meetup-join/${d.meetingUrl}`,
    validate: (d) => d.meetingUrl ? valid() : invalid('meetingUrl', 'Meeting URL is required'),
  },

  /* ════════ Social Media ════════ */
  youtube: {
    id: 'youtube',
    label: 'YouTube',
    icon: 'Play',
    category: 'social',
    fields: [
      { id: 'channelOrVideo', label: 'Channel or Video URL', type: 'text', placeholder: 'https://youtube.com/@channel or /watch?v=...', required: true },
    ],
    encode: (d) => d.channelOrVideo.startsWith('http') ? d.channelOrVideo : `https://youtube.com/${d.channelOrVideo}`,
    validate: (d) => d.channelOrVideo ? valid() : invalid('channelOrVideo', 'URL is required'),
  },
  instagram: {
    id: 'instagram',
    label: 'Instagram',
    icon: 'Camera',
    category: 'social',
    fields: [
      { id: 'username', label: 'Username', type: 'text', placeholder: 'username', required: true },
    ],
    encode: (d) => `https://instagram.com/${d.username.replace('@', '')}`,
    validate: (d) => d.username ? valid() : invalid('username', 'Username is required'),
  },
  facebook: {
    id: 'facebook',
    label: 'Facebook',
    icon: 'Facebook',
    category: 'social',
    fields: [
      { id: 'pageOrProfile', label: 'Page or Profile URL', type: 'text', placeholder: 'https://facebook.com/page or username', required: true },
    ],
    encode: (d) => d.pageOrProfile.startsWith('http') ? d.pageOrProfile : `https://facebook.com/${d.pageOrProfile}`,
    validate: (d) => d.pageOrProfile ? valid() : invalid('pageOrProfile', 'Page name or URL is required'),
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    icon: 'Linkedin',
    category: 'social',
    fields: [
      { id: 'profile', label: 'Profile URL or Username', type: 'text', placeholder: 'https://linkedin.com/in/username', required: true },
    ],
    encode: (d) => d.profile.startsWith('http') ? d.profile : `https://linkedin.com/in/${d.profile}`,
    validate: (d) => d.profile ? valid() : invalid('profile', 'Profile URL is required'),
  },
  tiktok: {
    id: 'tiktok',
    label: 'TikTok',
    icon: 'Music',
    category: 'social',
    fields: [
      { id: 'username', label: 'Username', type: 'text', placeholder: '@username', required: true },
    ],
    encode: (d) => `https://tiktok.com/@${d.username.replace('@', '')}`,
    validate: (d) => d.username ? valid() : invalid('username', 'Username is required'),
  },
  x: {
    id: 'x',
    label: 'X (Twitter)',
    icon: 'Twitter',
    category: 'social',
    fields: [
      { id: 'username', label: 'Username', type: 'text', placeholder: '@username', required: true },
      { id: 'tweet', label: 'Pre-filled Tweet', type: 'textarea', placeholder: 'Tweet text (optional)' },
    ],
    encode: (d) => {
      const username = d.username.replace('@', '');
      if (d.tweet) return `https://twitter.com/intent/tweet?text=${encodeURIComponent(d.tweet)}&via=${username}`;
      return `https://twitter.com/${username}`;
    },
    validate: (d) => d.username ? valid() : invalid('username', 'Username is required'),
  },
  github: {
    id: 'github',
    label: 'GitHub',
    icon: 'Github',
    category: 'social',
    fields: [
      { id: 'repo', label: 'Profile or Repository URL', type: 'text', placeholder: 'https://github.com/username or username', required: true },
    ],
    encode: (d) => d.repo.startsWith('http') ? d.repo : `https://github.com/${d.repo}`,
    validate: (d) => d.repo ? valid() : invalid('repo', 'URL is required'),
  },
  gitlab: {
    id: 'gitlab',
    label: 'GitLab',
    icon: 'Gitlab',
    category: 'social',
    fields: [
      { id: 'repo', label: 'Profile or Repository URL', type: 'text', placeholder: 'https://gitlab.com/username', required: true },
    ],
    encode: (d) => d.repo.startsWith('http') ? d.repo : `https://gitlab.com/${d.repo}`,
    validate: (d) => d.repo ? valid() : invalid('repo', 'URL is required'),
  },
  steam: {
    id: 'steam',
    label: 'Steam',
    icon: 'Gamepad2',
    category: 'social',
    fields: [
      { id: 'profileOrApp', label: 'Profile or App URL', type: 'text', placeholder: 'https://steamcommunity.com/id/username', required: true },
    ],
    encode: (d) => d.profileOrApp.startsWith('http') ? d.profileOrApp : `https://steamcommunity.com/id/${d.profileOrApp}`,
    validate: (d) => d.profileOrApp ? valid() : invalid('profileOrApp', 'URL is required'),
  },
  'epic-games': {
    id: 'epic-games',
    label: 'Epic Games',
    icon: 'Gamepad2',
    category: 'social',
    fields: [
      { id: 'displayName', label: 'Display Name', type: 'text', placeholder: 'Epic display name', required: true },
    ],
    encode: (d) => `https://store.epicgames.com/?friend=${encodeURIComponent(d.displayName)}`,
    validate: (d) => d.displayName ? valid() : invalid('displayName', 'Display name is required'),
  },

  /* ════════ Custom ════════ */
  'custom-uri': {
    id: 'custom-uri',
    label: 'Custom URI / Text',
    icon: 'Code',
    category: 'custom',
    fields: [
      { id: 'data', label: 'Custom Data', type: 'textarea', placeholder: 'Enter any text or URI to encode in QR', required: true },
    ],
    encode: (d) => d.data,
    validate: (d) => d.data ? valid() : invalid('data', 'Data is required'),
  },
};

/* ── Lookup helpers ──────────────────────────────────────────────────── */

export function getContentTypeConfig(id: QRContentType): QRContentTypeConfig | undefined {
  return QR_CONTENT_TYPES[id];
}

export function getAllContentTypes(): QRContentTypeConfig[] {
  return Object.values(QR_CONTENT_TYPES);
}

export function getContentTypesByCategory(category: string): QRContentTypeConfig[] {
  return Object.values(QR_CONTENT_TYPES).filter((c) => c.category === category);
}

export const CONTENT_TYPE_CATEGORIES = [
  { id: 'url', label: 'URL & Text' },
  { id: 'contact', label: 'Contact & Communication' },
  { id: 'network', label: 'Network' },
  { id: 'location', label: 'Location' },
  { id: 'social', label: 'Social Media' },
  { id: 'payment', label: 'Payment' },
  { id: 'crypto', label: 'Cryptocurrency' },
  { id: 'app', label: 'Apps & Meetings' },
  { id: 'custom', label: 'Custom' },
] as const;
