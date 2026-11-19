// YouTube behind a gate (plan Phase 9). Each `<figure class="video"><yt-facade video title start>` carries a plain link to
// the video; with JS it becomes a frame that never loads anything from Google until you say yes:
//  · no consent for YouTube yet (or rejected): the frame says so up front — the title, that it is on YouTube (Google) and
//    needs its cookies, what the «yes» means (the IP goes to Google, remembered 180 days for every video), a link to the
//    cookie policy, «Accept and watch here» (grants "youtube" and plays) and «Watch on YouTube ↗»; no thumbnail is fetched;
//  · with consent: the usual facade with its thumbnail; a click plays it in youtube-nocookie.com.
// A choice made anywhere (the card, the footer, another video) swaps the frame at once, even one with the player open.
import { allowed, grant, CT, POLICY } from './consent.js';
import { blogStrings } from '../i18n/blog.js';

const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (v == null) continue; if (k === 'class') n.className = v; else if (k === 'text') n.textContent = v; else n.setAttribute(k, v); }
  n.append(...kids.filter((k) => k != null && k !== false));
  return n;
};
const lang = document.documentElement.lang;
const play_ = blogStrings(lang.startsWith('ar') ? 'ar' : lang.startsWith('en') ? 'en' : 'es').play;

for (const facade of document.querySelectorAll('figure.video > yt-facade')) {
  const id = facade.getAttribute('video'), start = facade.getAttribute('start');
  const name = facade.getAttribute('title') || CT.video;          // a video without a title still has a name
  const frame = el('div', { class: 'video__frame' });
  facade.replaceWith(frame);

  const play = () => {
    const f = el('iframe', { src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1${start ? '&start=' + start : ''}`, title: name, allow: 'autoplay; encrypted-media; picture-in-picture', allowfullscreen: '' });
    frame.replaceChildren(f); f.focus();
  };
  const thumb = () => {
    const btn = el('button', { type: 'button', class: 'video__play', 'aria-label': `${play_}: ${name}` },
      el('picture', {}, el('img', { src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, alt: '', loading: 'lazy' })),
      el('span', { class: 'video__btn', 'aria-hidden': 'true' }, el('span', { text: '▶' })),
      el('span', { class: 'video__title', text: name }));
    btn.addEventListener('click', play);
    return btn;
  };
  const gate = () => {
    const yes = el('button', { type: 'button', class: 'consent__btn', text: CT.gateYes });
    yes.addEventListener('click', () => { grant('youtube'); play(); });
    // the notice is in the page's interface language, whatever the post's own
    return el('div', { class: 'video__gate', role: 'group', 'aria-label': name, lang, 'data-nosnippet': '' },
      el('p', { class: 'video__gate-title' }, el('span', { class: 'video__gate-icon', 'aria-hidden': 'true', text: '▶' }), name),
      el('p', {}, CT.gate, ' ', el('a', { href: POLICY, text: CT.policy }), '.'),
      el('p', { text: CT.gateOr }),
      el('div', { class: 'consent__actions' }, yes,
        el('a', { class: 'consent__btn consent__btn--quiet', href: `https://www.youtube.com/watch?v=${id}${start ? '&t=' + start + 's' : ''}`, target: '_blank', rel: 'noopener' },
          CT.gateNo, ' ↗', el('span', { class: 'vh', text: ' ' + CT.newTab }))));
  };
  const show = () => {
    const open = frame.querySelector('iframe');
    if (!allowed('youtube')) frame.replaceChildren(gate());          // taken back: the player goes too
    else if (!open) frame.replaceChildren(thumb());
  };
  show();
  document.addEventListener('luz:consent', () => { if (frame.isConnected) show(); });
}
