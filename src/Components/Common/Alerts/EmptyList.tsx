interface Props{
  title?      : string,
  subMessage? : string
}

const EmptyList = ({title, subMessage}:Props) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
      style={{
        background: 'rgba(var(--card))',
        border: '1px solid rgba(var(--border))',
      }}
    >
      <svg
        className="w-6 h-6"
        style={{ color: 'rgba(var(--copy-secondary))' }}
        viewBox="0 0 20 20" fill="none"
      >
        <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 7h6M7 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
    <p
      className="text-sm font-medium"
      style={{ color: 'rgba(var(--copy-primary))' }}
    >
      {
        title?
          title
        :
          'No pages found'
      }
    </p>
    <p
      className="text-xs mt-1"
      style={{ color: 'rgba(var(--copy-secondary))' }}
    >
      {
        subMessage?
          subMessage
        :
          'When data exists it should appear here'
      }
    </p>
  </div>
);

export default EmptyList