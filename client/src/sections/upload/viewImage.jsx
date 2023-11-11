
function ImageViewer({ imageURL }) {
    return (
        <div>
            <img crossorigin="anonymous" src={imageURL} alt="Health record " />
        </div>
    );
};

export default ImageViewer;