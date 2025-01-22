import { FaFileWord, FaFilePowerpoint, FaFileExcel, FaFilePdf } from 'react-icons/fa';

export default function getFileIcon(fileExtension: string): React.ReactNode {
    const extension = fileExtension.toLowerCase();

    switch (extension) {
        case 'odt':
            return <FaFileWord />;
        case 'doc':
        case 'docx':
            return <FaFileWord />;
        case 'ppt':
        case 'pptx':
            return <FaFilePowerpoint />;
        case 'xls':
        case 'xlsx':
            return <FaFileExcel />;
        case 'pdf':
            return <FaFilePdf />;
        default:
            return null;
    }
}
