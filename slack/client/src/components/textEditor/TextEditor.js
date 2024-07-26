import { containerCss, sendCss } from './TextEditor.style';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HiPaperAirplane } from 'react-icons/hi2';

const modules = {
  toolbar: {
    container: [
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ script: 'sub' }, { script: 'super' }],
    ],
  },
};

const TextEditor = ({
  text,
  onChangeTexthandler,
  reactQuillRef,
  onSendHandler,
}) => {
  return (
    <div css={containerCss}>
      <HiPaperAirplane css={sendCss} onClick={onSendHandler} />
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
