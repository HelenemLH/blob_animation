chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'addBlob') {
        // Create the blob element on the webpage
        const blob = document.createElement('img');
        blob.src = chrome.runtime.getURL('blob.png');
        blob.style.position = 'absolute';
        blob.style.width = '50px';
        blob.style.height = '50px';
        blob.style.top = '50px';
        blob.style.left = '50px';
        blob.style.cursor = 'grab';
        blob.id = 'blob';

        document.body.appendChild(blob);

        // Make the blob draggable on the webpage
        blob.addEventListener('mousedown', function (e) {
            const shiftX = e.clientX - blob.getBoundingClientRect().left;
            const shiftY = e.clientY - blob.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                blob.style.left = pageX - shiftX + 'px';
                blob.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            blob.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                blob.onmouseup = null;
            };
        });

        blob.ondragstart = function () {
            return false;  // Prevent the default drag behavior
        };
    }
});
