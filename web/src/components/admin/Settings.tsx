import { AxiosResponse } from "axios";
import React, { EffectCallback, useEffect, useState } from "react";
import { PetCategoriesResponse, PetCategory } from "../../../../models/pet";
import { pets as petsApi } from "../../common/api";

const Settings = () => {
    const [petTypes, setPetTypes] = useState<PetCategory[]>([]);
    const pollCategories: EffectCallback = () => {
        petsApi
            .getCategories()
            .then((res: AxiosResponse<PetCategoriesResponse>) =>
                setPetTypes(res.data.data)
            )
            .catch((err) => console.log(err));
    };
    useEffect(pollCategories, []);
    return (
        <div>
            {petTypes.map((type) => (
                <div>
                    <div>{type.typeName}</div>
                    <div>{type.baseDailyPrice}</div>
                </div>
            ))}
        </div>
    );
};

export default Settings;
