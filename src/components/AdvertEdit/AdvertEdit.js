import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Chip from '@material-ui/core/Chip';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SaveIcon from '@material-ui/icons/Save';
import CheckIcon from '@material-ui/icons/Check';
import CancelIcon from '@material-ui/icons/Cancel';

import Layout from '../Layout/Layout';

import imagePhoto from '../../assets/images/photo.png';

import './AdvertEdit.css';
import Advert from '../../models/Advert';

const defaultAdvert = {
  name: '',
  type: '',
  tags: [],
  price: 0,
  description: '',
  photo: '',
};

export default class AdvertEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photoTemp: '',
      openModal: false,
      advert: props.advert || defaultAdvert,
    };
  }

  componentDidMount() {
    if (this.isEditMode()) {
      this.getAdvert();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.isEditMode() && !prevProps.advert && this.props.advert) {
      this.setState({ advert: this.props.advert });
    }
  }

  isEditMode = () => this.props.match.params.id;

  getAdvert = () => {
    const { loadAdvert, match } = this.props;
    loadAdvert(match.params.id);
  };

  errorNotify = message =>
    this.props.enqueueSnackbar(message, {
      variant: 'error',
    });

  successNotify = message =>
    this.props.enqueueSnackbar(message, {
      variant: 'success',
    });

  handleChange = ({ target: { name, value } }) =>
    this.setState(({ advert }) => ({
      advert: {
        ...advert,
        [name]: value,
      },
    }));

  handleChangeNumber = ({ target: { name, value } }) =>
    this.setState(({ advert }) => ({
      advert: {
        ...advert,
        [name]: parseFloat(value),
      },
    }));

  handleChangeMultiple = ({ target: { value } }) =>
    this.setState(({ advert }) => ({
      advert: {
        ...advert,
        tags: value,
      },
    }));

  handleSubmit = ev => {
    const { createOrUpdateAdvert } = this.props;
    ev.preventDefault();
    const editMode = this.isEditMode();
    const advert = new Advert(this.state.advert);
    if (advert.isValid()) {
      createOrUpdateAdvert(advert)
        .then(() =>
          this.successNotify(
            editMode
              ? 'OK. Anuncio editado con exito.'
              : 'OK. Anuncio creado con exito.',
          ),
        )
        .catch(() =>
          this.errorNotify(
            editMode ? 'Error editando anuncio.' : 'Error creando anuncio.',
          ),
        );
    } else {
      this.errorNotify('Los datos del anuncio no están completos');
    }
  };

  handleSwitchOpen = () => {
    this.setState(({ advert, openModal }) => ({
      photoTemp: advert.photo,
      openModal: !openModal,
    }));
  };

  handleChangePhoto = () => {
    if (this.state.photoTemp) {
      this.setState(({ advert, photoTemp }) => {
        return {
          advert: {
            ...advert,
            photo: photoTemp,
          },
          openModal: false,
        };
      });
    } else {
      this.errorNotify('Debe indicar una URL a una imagen primero');
    }
  };

  renderValue = () => {
    const { advert } = this.state;
    if (!advert.tags) {
      return null;
    }
    return (
      <div>
        {advert.tags.map(value => (
          <Chip
            key={value}
            size="small"
            label={value}
            className={`Ad__Tag Ad__Tag--small Ad__Tag--${value}`}
          />
        ))}
      </div>
    );
  };

  render() {
    const {
      match: { params },
      tags,
      error,
    } = this.props;
    const { advert, openModal, photoTemp } = this.state;
    const editMode = this.isEditMode();
    if (error) return <Redirect to="/notfound" />;
    return (
      <Layout
        sectionTitle={editMode ? 'Editar anuncio' : 'Crear nuevo anuncio'}
      >
        <form
          onSubmit={this.handleSubmit}
          noValidate
          autoComplete="off"
          className="AdvertEdit__Form"
        >
          <button
            type="button"
            className="AdvertEdit_Picture"
            onClick={this.handleSwitchOpen}
          >
            <img src={advert.photo || imagePhoto} alt="dummy_photo" />
          </button>
          <FormControl fullWidth className="AdvertEdit__FormControl">
            <InputLabel shrink htmlFor="type">
              Nombre
            </InputLabel>
            <Input
              name="name"
              value={advert.name}
              onChange={this.handleChange}
              type="text"
              required
            />
          </FormControl>
          <FormControl fullWidth className="AdvertEdit__FormControl">
            <InputLabel shrink htmlFor="type">
              Tipo
            </InputLabel>
            <Select
              name="type"
              onChange={this.handleChange}
              className="SearchPanel__Type"
              value={advert.type}
              displayEmpty
            >
              <MenuItem key="buy" value="buy">
                <Chip
                  size="small"
                  label="buy"
                  className="Ad__Tag Ad__Tag--small Ad__Tag--buy"
                />
              </MenuItem>
              <MenuItem key="sell" value="sell">
                <Chip
                  size="small"
                  label="sell"
                  className="Ad__Tag Ad__Tag--small Ad__Tag--sell"
                />
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth className="AdvertEdit__FormControl">
            <InputLabel shrink htmlFor="tags">
              Tags
            </InputLabel>
            <Select
              multiple
              name="tags"
              value={advert.tags || ''}
              onChange={this.handleChangeMultiple}
              renderValue={() => (
                <div>
                  {advert.tags.map(value => (
                    <Chip
                      key={value}
                      size="small"
                      label={value}
                      className={`Ad__Tag Ad__Tag--small Ad__Tag--${value}`}
                    />
                  ))}
                </div>
              )}
            >
              {tags &&
                tags.map((value, key) => {
                  return (
                    <MenuItem key={key} value={value}>
                      <Chip
                        key={key}
                        size="small"
                        label={value}
                        className={`Ad__Tag Ad__Tag--small Ad__Tag--${value}`}
                      />
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
          <FormControl fullWidth className="AdvertEdit__FormControl">
            <InputLabel htmlFor="price">Price</InputLabel>
            <Input
              name="price"
              type="number"
              value={advert.price}
              onChange={this.handleChangeNumber}
              endAdornment={<InputAdornment position="start">€</InputAdornment>}
            />
          </FormControl>
          <FormControl fullWidth className="AdvertEdit__FormControl">
            <TextField
              name="description"
              label="Descripción"
              value={advert.description}
              onChange={this.handleChange}
              multiline
              rows={2}
              helperText="Introduce una descripción para el anuncio"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </FormControl>
          <div className="AdvertEdit__Footer">
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              className="ButtonWallakeep ButtonWallakeep__Green"
            >
              Guardar
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              startIcon={<CancelIcon />}
              component={Link}
              to={params.id ? `/advert/${params.id}` : '/'}
            >
              Cancel
            </Button>
          </div>
        </form>
        <Dialog open={openModal} className="AdvertEdit__Modal">
          <DialogTitle className="Modal_Title">URL de la imagen</DialogTitle>
          <DialogContent className="Modal__Content">
            <DialogContentText>
              La API de nodepop no admite carga de imagenes locales por el
              momento. Por favor, indique la URL a la imagen que desea añadir al
              anuncio
            </DialogContentText>
            <TextField
              autoFocus
              name="photoTemp"
              value={photoTemp}
              onChange={ev => {
                this.setState({ photoTemp: ev.target.value });
              }}
              margin="dense"
              label="URL Imagen"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions className="Modal__Actions">
            <Button
              onClick={this.handleChangePhoto}
              variant="contained"
              startIcon={<CheckIcon />}
              className="ButtonWallakeep ButtonWallakeep__Green"
            >
              Aceptar
            </Button>
            <Button
              onClick={this.handleSwitchOpen}
              variant="contained"
              startIcon={<CancelIcon />}
              color="secondary"
            >
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </Layout>
    );
  }
}
