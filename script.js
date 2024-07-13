document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded!");

    // Toggle navigation menu on menu icon click
    const menuIcon = document.querySelector('.menu-icon');
    menuIcon.addEventListener('click', function() {
        const navLinks = document.getElementById('nav-links');
        navLinks.classList.toggle('show');
    });
    
    let slideIndex = 0;
    showSlides();

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

    // Reference to the comments in the Firebase database
    const commentsRef = firebase.database().ref('comments');

    // Function to render comments from Firebase
    function renderComments(snapshot) {
        const commentsDisplay = document.getElementById('comments-display');
        commentsDisplay.innerHTML = ''; // Clear the current comments
        snapshot.forEach(function(childSnapshot) {
            const commentData = childSnapshot.val();
            const commentDiv = createCommentElement(commentData.text, commentData.image, childSnapshot.key);
            commentsDisplay.appendChild(commentDiv);
        });
        updateCommentCount();
    }

    // Fetch comments from Firebase
    commentsRef.on('value', renderComments);

    document.getElementById('comment-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const commentText = document.getElementById('comment').value;
        const pictureFile = document.getElementById('picture').files[0];

        if (commentText === '' && !pictureFile) {
            alert('Please enter a comment or select a picture to upload.');
            return;
        }

        const newCommentRef = commentsRef.push();
        if (pictureFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const commentData = {
                    text: commentText,
                    image: e.target.result
                };
                newCommentRef.set(commentData);
            }
            reader.readAsDataURL(pictureFile);
        } else {
            newCommentRef.set({
                text: commentText,
                image: null
            });
        }

        document.getElementById('comment-form').reset();
    });

    function createCommentElement(text, imageUrl, commentId) {
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
        commentParagraph.textContent = text;
        commentContentDiv.appendChild(commentParagraph);

        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            commentContentDiv.appendChild(img);
        }

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            const commentRef = firebase.database().ref('comments/' + commentId);
            commentRef.remove();
        });
        commentDiv.appendChild(profileIconDiv);
        commentDiv.appendChild(commentContentDiv);
        commentDiv.appendChild(deleteButton);

        return commentDiv;
    }

    function updateCommentCount() {
        const commentsDisplay = document.getElementById('comments-display');
        const comments = commentsDisplay.getElementsByClassName('comment');
        while (comments.length > 5) {
            const oldestCommentId = comments[0].querySelector('.delete-button').getAttribute('data-id');
            const oldestCommentRef = firebase.database().ref('comments/' + oldestCommentId);
            oldestCommentRef.remove();
        }
    }
});
