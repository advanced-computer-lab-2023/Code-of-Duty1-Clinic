function MedicineImage({ MedicineID, backUpURL }) {
    return (
        <div>
            <img
                crossOrigin="use-credentials"
                src={`http://localhost:3000/upload/medicine/image/${MedicineID}`}
                onError={(event) => (event.target.src = backUpURL ? backUpURL : "assets/images/pills-white.jpg")}
                alt="Medicine"
            // width='100px'
            />
        </div>
    );
}

export { MedicineImage };
