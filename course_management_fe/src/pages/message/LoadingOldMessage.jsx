import { Oval } from 'react-loader-spinner';

export default function LoadingOldMessage({ isLoading }) {
    return (
        <div style={{
            right: '38%',
            top: '20%',
            position: 'fixed',
            zIndex: '9999'

        }}>
            <Oval
                visible={isLoading}
                width="24"
                color="#070758"
                ariaLabel="infinity-spin-loading"
            />
        </div>
    )

}