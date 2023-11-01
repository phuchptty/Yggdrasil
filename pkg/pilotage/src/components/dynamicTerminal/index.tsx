import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import React, { useEffect, useRef } from 'react';
import styles from '@/views/workspace/thirdTab/index.module.scss';

type Props = {
    terminal: Terminal | undefined;
    setTerminal: React.Dispatch<any>;
    onTerminalResize: (cols: number, rows: number) => void;
};

export default function DynamicTerminal(props: Props) {
    const term = new Terminal();
    const fitAddon = new FitAddon();

    const terminalRef: any = useRef(null);

    useEffect(() => {
        term.loadAddon(fitAddon);
        term.open(terminalRef.current!);
        term.resize(12, 4);
        fitAddon.fit();

        props.setTerminal(term);

        term.writeln('Virtual console created...');

        // Send resize
        const proprose = fitAddon.proposeDimensions();

        if (proprose) {
            props.onTerminalResize(proprose.cols, proprose.rows);
        }

        const xterm_resize_ob = new ResizeObserver(function (entries) {
            // since we are observing only a single element, so we access the first element in entries array
            try {
                fitAddon && fitAddon.fit();

                // Notice socket
                const proprose = fitAddon.proposeDimensions();

                if (proprose) {
                    props.onTerminalResize(proprose.cols, proprose.rows);
                }
            } catch (err) {
                console.log(err);
            }
        });

        // start observing for resize
        xterm_resize_ob.observe(terminalRef.current);
    }, []);

    // Add logic around `term`
    return <div ref={terminalRef} id={'terminal'} className={styles.terminalContainer}></div>;
}
