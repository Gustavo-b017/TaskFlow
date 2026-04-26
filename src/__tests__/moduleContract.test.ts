import { CustomButton } from '../components/CustomButton';
import { CustomInput } from '../components/CustomInput';
import { EmptyState } from '../components/EmptyState';
import { StatusBadge } from '../components/StatusBadge';
import { formatDate } from '../utils/formatDate';
import { generateId } from '../utils/generateId';
import { AppRoutes } from '../routes/AppRoutes';
import { TabRoutes } from '../routes/TabRoutes';

describe('spec structure contract', () => {
  it('exports required modules from required paths', () => {
    expect(CustomButton).toBeDefined();
    expect(CustomInput).toBeDefined();
    expect(EmptyState).toBeDefined();
    expect(StatusBadge).toBeDefined();
    expect(formatDate).toBeDefined();
    expect(generateId).toBeDefined();
    expect(AppRoutes).toBeDefined();
    expect(TabRoutes).toBeDefined();
  });
});
