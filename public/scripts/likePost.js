/* eslint-disable no-undef */
(function main() {
  const likePostBtn = document.querySelectorAll('.post__actions-likes');
  likePostBtn.forEach((btn) => {
    btn.onclick = async () => {
      if (!btn.dataset.auth) {
        window.location.replace('/signin');
        return;
      }
      const { postId, action } = btn.dataset;
      const res = await fetch(`/api/like-post?action=${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
        }),
      });
      const likeCount = btn.parentNode.nextSibling;
      if (res.ok) {
        if (action === 'like') {
          btn.dataset.action = 'unlike';
          btn.classList.add('post__actions-likes--liked');
          likeCount.classList.remove('post__likes--hidden');
          const count = likeCount.querySelector('.post__like-count');
          count.textContent = parseInt(count.textContent, 10) + 1;
        } else {
          btn.dataset.action = 'like';
          btn.classList.remove('post__actions-likes--liked');
          const count = likeCount.querySelector('.post__like-count');
          count.textContent = parseInt(count.textContent, 10) - 1;
          if (count.textContent == 0) {
            likeCount.classList.add('post__likes--hidden');
          }
        }
      }
    };
  });
}());
