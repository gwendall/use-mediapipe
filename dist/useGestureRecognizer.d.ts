import { GestureRecognizer, GestureRecognizerOptions, GestureRecognizerResult } from "@mediapipe/tasks-vision";
export { GestureRecognizer, GestureRecognizerOptions, GestureRecognizerResult };
export declare const defaultGestureRecognizerOptions: {
    baseOptions: {
        modelAssetPath: string;
        delegate: string;
    };
    runningMode: any;
    numHands: number;
};
export declare function getGestureRecognizer(options?: GestureRecognizerOptions): Promise<GestureRecognizer>;
export declare function useGestureRecognizer({ onResults, }: {
    onResults: (result?: GestureRecognizerResult, stream?: MediaStream) => void;
}): ({ stream, gestureRecognizerOptions, userMediaOptions, }?: {
    stream?: MediaStream | undefined;
    gestureRecognizerOptions?: GestureRecognizerOptions | undefined;
    userMediaOptions?: MediaStreamConstraints | undefined;
}) => Promise<void>;
//# sourceMappingURL=useGestureRecognizer.d.ts.map