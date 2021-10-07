import { FC } from "react";
import { Headers } from "../../components/Headers";
import { FontWeight, GradientColor, GradientText, TextSize } from "../../components/GradientText";

export const HomePage: FC = () => {
    return (
        <div className="w-full h-full flex flex-row items-center justify-center">
            <Headers
                title="Amitoj Singh"
                des="Amitoj Singh" />

            <GradientText
                size={TextSize["7xl"]}
                fontWeight={FontWeight.bold}
                colors={GradientColor["green-blue-purple"]}>
                Amitoj Singh
            </GradientText>

        </div>
    )
}