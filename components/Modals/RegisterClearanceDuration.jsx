import { registerDayForClearance } from '@/validations/registrationValidation';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';

const RegisterClearanceDuration = ({ onCancel }) => {
    const [day, setDay] = useState(0);
    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm({ resolver: yupResolver(registerDayForClearance) });

    useEffect(() => {
        // Fetch the day from the API
        const fetchDay = async () => {
            try {
                const response = await fetch('/api/clearanceDate', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const dayData = await response.json();
                    console.log('Day fetched successfully', dayData);
                    setDay(dayData[0].day);
                } else {
                    console.error('Failed to fetch day');
                }

            } catch (error) {
                console.error(error);
            }
        };

        fetchDay();
    }, [day]);
    const onSubmit = async (data) => {
        // Call your update API here to update the day
        // You can pass the updated day value as a parameter to the API

        // Example API call using fetch:
        try {
            const response = await fetch('/api/clearanceDate', {
                method: 'PATCH',
                body: JSON.stringify({

                    day: data.day
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // const response = await fetch('/api/clearanceDate', {
            //     method: 'POST',
            //     body: JSON.stringify({

            //         day: data.day
            //     }),
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });

            if (response.ok) {
                toast.success('Day updated successfully');
                // Handle the response from the API if needed
                console.log('Day updated successfully');
            } else {
                // Handle the error response from the API if needed
                console.error('Failed to update day');
            }





        } catch (error) {
            // Handle any errors that occur during the API call
            console.error(error);
        }
    };



    const handleCancel = () => {
        onCancel();
    };
    return (
        <div className="w-full max-w-142.5 rounded-lg bg-white py-12 px-8  dark:bg-boxdark md:py-15 md:px-8.5">
            <h3 className="pb-2 text-left text-lg font-bold text-black dark:text-white sm:text-2xl">
                Register Clearance Duration
            </h3>
            <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full ">
                        <label
                            className="mb-3 block text-sm font-medium text-black dark:text-white"
                            htmlFor="phoneNumber"
                        >
                            Clearance Duration
                        </label>
                        <input
                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="number"
                            name="day"
                            id="day"
                            min={1}
                            max={30}
                            placeholder={day}
                            {...register("day")}
                        />
                        <p>{errors.day?.message}</p>

                    </div>
                </div>
                <div className="-mx-3 mt-10 flex flex-wrap gap-y-4">
                    <div className="w-full px-3 2xsm:w-1/2">
                        <button
                            type="submit"
                            className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                        >
                            Save
                        </button>
                    </div>

                    <div className="w-full px-3 2xsm:w-1/2">
                        <button
                            onClick={handleCancel}
                            className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default RegisterClearanceDuration;