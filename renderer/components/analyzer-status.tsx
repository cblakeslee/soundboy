import styled from '@emotion/styled';
import React, { ReactNode } from 'react';
import { GrClose } from 'react-icons/gr';
import { Box, Flex, Heading } from 'rebass';
import { Line } from 'rc-progress';

import useAppState from '../hooks/useAppState';
import useTheme from '../hooks/useTheme';

import Card from './card';
import Clickable from './clickable';

const Container = styled(Card)`
    margin-top: 22px;
`;

const ProgressContainer = styled(Box)`
    width: 100%;
    max-width: 100%;
    word-wrap: break-word;
    display: inline-block;
`;

const StyledHeading = styled(Heading)`
    margin-top: 0;
`;

const Errors = styled(Box)`
    padding-bottom: 10px;
    max-height: 200px;
    overflow: scroll;
`;

const ErrorMessage = styled.div<{ color?: string }>`
    margin-top: 10px;
    width: 100%;
    font-size: 13px;
    color: ${(props) => props.color};
    word-break: break-all;
`;

export default function AnalyzerStatus() {
    const {
        dispatch,
        state: { analyzer },
    } = useAppState();
    const theme = useTheme();

    if (analyzer.tasks.length === 0 || (!analyzer.running && analyzer.errors.length === 0)) {
        return null;
    }

    const percent = (analyzer.completed / analyzer.tasks.length) * 100;

    let headerContent: ReactNode | undefined;
    if (analyzer.running) {
        let latest = analyzer.latest || `${analyzer.tasks.length} sound files, this might take a while...`;
        if (latest && analyzer.folder) {
            latest = latest.replace(analyzer.folder, '');
        }

        headerContent = (
            <ProgressContainer>
                <small>Analyzing {latest}</small>
                <Line percent={percent} strokeColor={theme.colors.secondary} />
            </ProgressContainer>
        );
    } else {
        const dismiss = () => dispatch({ type: 'analyzer_dismiss' });

        headerContent = (
            <Flex justifyContent='space-between'>
                <Box>
                    <StyledHeading my={2} color='red' fontWeight='bold' fontSize={[4, 3]}>
                        Failed to Analyze {analyzer.errors.length} Sounds
                    </StyledHeading>
                </Box>
                <Box>
                    <Clickable onClick={dismiss}>
                        <GrClose />
                    </Clickable>
                </Box>
            </Flex>
        );
    }

    return (
        <Container>
            {headerContent}
            {analyzer.errors.length > 0 && (
                <Errors>
                    {analyzer.errors.map((error, i) => (
                        <ErrorMessage key={`${i}:${error.message}`}>{error.message}</ErrorMessage>
                    ))}
                </Errors>
            )}
        </Container>
    );
}
