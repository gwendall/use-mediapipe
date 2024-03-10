"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGestureRecognizer = exports.getGestureRecognizer = exports.defaultGestureRecognizerOptions = exports.GestureRecognizer = void 0;
const react_1 = __importDefault(require("react"));
const tasks_vision_1 = require("@mediapipe/tasks-vision");
Object.defineProperty(exports, "GestureRecognizer", { enumerable: true, get: function () { return tasks_vision_1.GestureRecognizer; } });
const canPlayStream_1 = __importDefault(require("./canPlayStream"));
exports.defaultGestureRecognizerOptions = {
    runningMode: 'VIDEO',
    numHands: 2,
};
function getGestureRecognizer() {
    return __awaiter(this, arguments, void 0, function* (options = {}) {
        const tasksVision = yield tasks_vision_1.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm");
        const gestureRecognizer = yield tasks_vision_1.GestureRecognizer.createFromOptions(tasksVision, Object.assign(Object.assign({ baseOptions: {
                modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
                delegate: "GPU",
            } }, exports.defaultGestureRecognizerOptions), options));
        return gestureRecognizer;
    });
}
exports.getGestureRecognizer = getGestureRecognizer;
function useGestureRecognizer({ onResults, }) {
    const videoRef = react_1.default.useRef(null);
    const gestureRecognizerRef = react_1.default.useRef();
    const lastVideoTimeRef = react_1.default.useRef(-1);
    function predictGesture(time, stream) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!videoRef.current || !gestureRecognizerRef.current)
                return;
            const startTimeMs = performance.now();
            const currentTime = videoRef.current.currentTime;
            if ((0, canPlayStream_1.default)(stream) && currentTime !== lastVideoTimeRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                lastVideoTimeRef.current = currentTime;
                const results = yield ((_a = gestureRecognizerRef.current) === null || _a === void 0 ? void 0 : _a.recognizeForVideo(videoRef.current, startTimeMs));
                onResults === null || onResults === void 0 ? void 0 : onResults(results, stream);
            }
            (_b = videoRef.current) === null || _b === void 0 ? void 0 : _b.requestVideoFrameCallback((time) => predictGesture(time, stream));
        });
    }
    function startGestureTracking() {
        return __awaiter(this, arguments, void 0, function* ({ stream, gestureRecognizerOptions, } = {
            stream: undefined,
            gestureRecognizerOptions: undefined,
        }) {
            gestureRecognizerRef.current = yield getGestureRecognizer(gestureRecognizerOptions);
            videoRef.current = document.createElement("video");
            videoRef.current.playsInline = true;
            videoRef.current.crossOrigin = "anonymous";
            videoRef.current.srcObject = stream || (yield navigator.mediaDevices
                .getUserMedia({
                audio: false,
                video: {
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                    facingMode: "user",
                },
            }));
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();
            };
            const _stream = videoRef.current.srcObject;
            videoRef.current.requestVideoFrameCallback((time) => predictGesture(time, _stream));
        });
    }
    return startGestureTracking;
}
exports.useGestureRecognizer = useGestureRecognizer;
