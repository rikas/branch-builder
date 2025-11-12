import { Content, Heading, IllustratedMessage, Link } from '@adobe/react-spectrum';
import EmptyStateIllustration from './EmptyStateIllustration';

type Props = {
  onStartPressed: () => void;
  onLoadPressed: () => void;
};

export function DynamicTreeEmptyState({
  onStartPressed,
  onLoadPressed,
}: Props): React.ReactElement {
  return (
    <IllustratedMessage>
      <EmptyStateIllustration />
      <Heading>No folder structure loaded</Heading>
      <Content>
        Start by <Link onPress={onStartPressed}>creating a new structure</Link> or{' '}
        <Link onPress={onLoadPressed}>load an existing configuration</Link>.
      </Content>
    </IllustratedMessage>
  );
}
