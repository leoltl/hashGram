/* eslint-disable no-undef */
(function main() {
  const followBtn = document.querySelector('.profile__follow-btn');
  const followers = document.querySelector('.profile__follower-count');
  const userhandle = followBtn.dataset.userHandle;

  const { action } = followBtn.dataset;

  followBtn.onclick = async () => {
    const res = await fetch(`/api/follow?action=${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userhandle,
      }),
    });
    if (res.ok) {
      const delta = action === 'follow' ? 1 : -1;
      followers.textContent = parseInt(followers.textContent, 10) + delta;
      followBtn.textContent = action === 'follow' ? 'unfollow' : 'follow';
    }
  };
}());
