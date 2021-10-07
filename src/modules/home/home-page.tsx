import { FC } from "react";
import { Headers } from "../../components/Headers";
import { FontWeight, GradientColor, GradientText, TextSize } from "../../components/GradientText";
import { ColorMode, useColorMode } from "../../hooks/useColorMode";

export const HomePage: FC = () => {

    const changeMode = () => {
        useColorMode.getState().setColorMode({
            mode: useColorMode.getState().mode === ColorMode.dark ? ColorMode.light : ColorMode.dark
        })
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <Headers
                title="Amitoj Singh"
                des="Amitoj Singh" />

            <GradientText
                size={TextSize["7xl"]}
                fontWeight={FontWeight.bold}
                colors={GradientColor["green-blue-purple"]}
                style={{
                    textShadow: '0px 0px 100px rgba(52, 211, 153, 0.4)'
                }}
            >
                Amitoj Singh
            </GradientText>

            <button className="mt-20" onClick={changeMode}>Change Mode</button>

        </div>
    )
}