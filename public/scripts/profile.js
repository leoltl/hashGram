/* eslint-disable no-undef */
(function main() {
  const followBtn = document.querySelector('.profile__follow-btn');
  const followers = document.querySelector('.profile__follower-count');
  const userhandle = followBtn.dataset.userHandle;

  followBtn.onclick = async () => {
    console.log(userhandle, JSON.stringify({
      userhandle,
    }));
    const res = await fetch('/api/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userhandle,
      }),
    });
    if (res.ok) {
      console.log(followers.textContent);
      followers.textContent = parseInt(followers.textContent, 10) + 1;
    }
  };
}());