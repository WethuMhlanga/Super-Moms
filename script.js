document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded!");

    // Toggle navigation menu on menu icon click
    const menuIcon = document.querySelector('.menu-icon');
    menuIcon.addEventListener('click', function() {
        const navLinks = document.getElementById('nav-links');
        navLinks.classList.toggle('show');
    });
    
    let slideIndex = 0;
    showSlides();zz

    function showSlides() {
        let slides = document.getElementsByClassName("slide");
        let dots = document.getElementsByClassName("dot");
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }
        slideIndex++;
        if (slideIndex > slides.length) {slideIndex = 1}    
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex-1].style.display = "block";  
        dots[slideIndex-1].className += " active";
        setTimeout(showSlides, 4000); // Change image every 4 seconds
    }

    document.getElementById('comment-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const commentText = document.getElementById('comment').value;
        const pictureFile = document.getElementById('picture').files[0];

        if (commentText === '' && !pictureFile) {
            alert('Please enter a comment or select a picture to upload.');
            return;
        }

        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');

        const profileIconDiv = document.createElement('div');
        profileIconDiv.classList.add('profile-icon');
        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-comment');
        icon.style.fontSize = '36px';
        profileIconDiv.appendChild(icon);

        const commentContentDiv = document.createElement('div');
        commentContentDiv.classList.add('comment-content');
        const commentParagraph = document.createElement('p');
        commentParagraph.textContent = commentText;
        commentContentDiv.appendChild(commentParagraph);

        if (pictureFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                commentContentDiv.appendChild(img);
            }
            reader.readAsDataURL(pictureFile);
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            commentDiv.remove();
            updateCommentCount();
        });
        commentDiv.appendChild(profileIconDiv);
        commentDiv.appendChild(commentContentDiv);
        commentDiv.appendChild(deleteButton);

        const commentsDisplay = document.getElementById('comments-display');
        commentsDisplay.appendChild(commentDiv);

        updateCommentCount();

        document.getElementById('comment-form').reset();
    });

    function updateCommentCount() {
        const commentsDisplay = document.getElementById('comments-display');
        const comments = commentsDisplay.getElementsByClassName('comment');
        while (comments.length > 5) {
            comments[0].remove();
        }
    }
});
