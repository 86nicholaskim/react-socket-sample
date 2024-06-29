import { containerCss, sendCss } from './TextEditor.style';
import ReactQuill, { Quill } from './react-quill';
import 'react-quill/dis/quill/snow.css';
import { HiPaperAirPlane } from 'react-icons/hi2';

const modules = {
  toolbar: {},
};

const TextEditor = ({
  text,
  onChangeTexthandler,
  reactQuillRef,
  onSendhandler,
}) => {
  return (
    <div css={containerCss}>
      <HiPaperAirPlane css={sendCss} onClick={onSendhandler} />
      <ReactQuill
        theme="snow"
        modules={modules}
        value={text}
        onChange={onChangeTexthandler}
        ref={(el) => {
          reactQuillRef.current = el;
        }}
      ></ReactQuill>
    </div>
  );
};
export default TextEditor;
