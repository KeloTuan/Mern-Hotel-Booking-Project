import { useMutation } from "react-query";
import ManageHotelForm from "../forms/MangeHotelForm/MangeHotelForm";
import { useAppContext } from "../context/AppContext";
import * as apiClient from "../api-client";

const AddHotel = () => { //Tao giao dien bang function nay
    const { showToast } = useAppContext();

    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: () => {
            showToast({ message: "Hotel Saved!", type: "SUCCESS" });
        },

        onError: () => {
            showToast({ message: "Error Saving Hotel", type: "ERROR" });
        },
    });

    const handleSave = (hotelFormData: FormData) => {
        mutate(hotelFormData)
    };

    return <ManageHotelForm onSave={handleSave} isLoading={isLoading}/>;
};

export default AddHotel;