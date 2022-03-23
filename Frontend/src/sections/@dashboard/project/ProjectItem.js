import PropTypes from 'prop-types';

// hooks
import { useState } from 'react';
import { useTheme } from '@emotion/react';
import useProjectFilter from 'src/hooks/useProjectFilter';
import useProject from 'src/hooks/useProject';
import { useParams } from 'react-router';
import useAuth from 'src/hooks/useAuth';

// @mui
import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  IconButton,
  Typography,
  CardContent,
  CircularProgress,
  Button,
  InputAdornment,
  MenuItem,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
} from '@mui/material';

//react router link
import { Link as RouterLink } from 'react-router-dom';

// utils
import { fDate, fTimestamp } from '../../../utils/formatTime';
import cssStyles from '../../../utils/cssStyles';
// components
import Image from '../../../components/Image';
import Iconify from '../../../components/Iconify';
import LightboxModal from '../../../components/LightboxModal';
import Label from 'src/components/Label';
import { sentenceCase } from 'change-case';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { PATH_DASHBOARD } from 'src/routes/paths';
import { DialogAnimate } from 'src/components/animate';
import { CalendarForm } from '../calendar';
import AddProjectForm from './AddProjectForm';
import InputStyle from 'src/components/InputStyle';
import MenuPopover from 'src/components/MenuPopover';
import MoreProjectOptions from './MoreProjectOptions';

// ----------------------------------------------------------------------
const CaptionStyle = styled(CardContent)(({ theme }) => ({
  ...cssStyles().bgBlur({ blur: 2, color: theme.palette.grey[900] }),
  bottom: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  justifyContent: 'space-between',
  color: theme.palette.common.white,
}));
// ----------------------------------------------------------------------

ProjectItem.propTypes = {
  image: PropTypes.object,
  onOpenLightbox: PropTypes.func,
};

export default function ProjectItem({ project, image, onOpenLightbox }) {
  const { description, name, startDate, expectedEndDate, _id, workspace, isDeleted } = project;
  const { deleteProjectHook, restoreProjectHook } = useProject();
  const { user } = useAuth();

  const [projectId, setProjectId] = useState(_id);
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const now = new Date();
  const expectedEndDateJs = new Date(expectedEndDate);

  const projectCompleted = expectedEndDateJs.getTime() < now.getTime();

  const color = projectCompleted ? 'error' : 'in_progress' && 'warning';

  const handleRestore = () => restoreProjectHook({ projectId: _id, workspaceId: workspace, memberId: user._id });

  const { id } = useParams();
  const linkTo = `${PATH_DASHBOARD.workspaces.details}${id}/project/${project._id}`;

  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image alt="gallery image" ratio="1/1" src={''} />
      {isDeleted ? (
        <Label
          sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
          variant={isLight ? 'ghost' : 'filled'}
          color="error"
        >
          {sentenceCase('deleted')}
        </Label>
      ) : (
        <Label
          sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
          variant={isLight ? 'ghost' : 'filled'}
          color={color}
        >
          {projectCompleted ? sentenceCase('overdue') : sentenceCase('in progress')}
        </Label>
      )}

      <CaptionStyle>
        <div>
          <Link to={linkTo} color="inherit" component={RouterLink}>
            <Typography variant="subtitle1">{name}</Typography>
          </Link>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Due Date
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>
            {fDate(expectedEndDateJs)}
          </Typography>
        </div>
        {isDeleted ? (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<Iconify icon={'eva:heart-fill'} width={20} height={20} />}
            onClick={handleRestore}
          >
            Restore
          </Button>
        ) : (
          <MoreProjectOptions
            deleteProjectHook={deleteProjectHook}
            user={user}
            projectId={projectId}
            workspaceId={workspace}
            linkTo={linkTo}
          />
        )}
      </CaptionStyle>
    </Card>
  );
}
