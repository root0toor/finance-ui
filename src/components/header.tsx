import { ReactNode } from 'react';
import styled from 'styled-components';

const StyledHeader = styled.div({
    padding: '10px',
    '& > *': {
        padding: '10px',
    },
});

export default function Header({ children }: { children: ReactNode }) {
    return <StyledHeader>{children}</StyledHeader>;
}
