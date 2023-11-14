
function ImageViewer({ url }) {
    console.log('Image URL:', url); // Log the URL
    return (
        <div>
            <img crossOrigin="use-credentials" src={url} alt="Health record " />
        </div>
    );
};

export default ImageViewer;



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ImageViewer = ({ url }) => {
//     const [imageURL, setImageURL] = useState('');
//     useEffect(() => {
//         console.log(imageURL);
//     }, [imageURL]);
//     useEffect(() => {
//         const loadImage = async () => {
//             try {
//                 const response = await axios.get(url, {
//                     withCredentials: true,
//                 });
//                 // console.log(response, "------------*-");
//                 setImageURL(URL.createObjectURL(new Blob([response.data]), { type: 'image/jpeg' }));
//                 console.log(imageURL);
//                 if (!imageURL) {
//                     return <div>Loading...</div>;
//                 }
//             } catch (error) {
//                 console.error('Error loading image:', error);
//             }
//         };

//         loadImage();
//     }, []);

//     return <img src={imageURL} alt="Your Image" />;
// };

// export default ImageViewer;
