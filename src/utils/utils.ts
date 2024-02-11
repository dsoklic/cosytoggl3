type TicketInfo = { rt: number | undefined, desc: string }
export function getTicketInfo(description: string): TicketInfo {
    const findTicket = /(RT#(\d{4,7}):)?\s*(.+)/
    const found = description.match(findTicket)

    const rtNum = (found?.[2] !== undefined) ? parseInt(found[2]) : undefined;
    const text = found?.[3] ?? '';

    return {
        rt: rtNum,
        desc: text,
    };
}