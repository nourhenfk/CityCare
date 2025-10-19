import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { ReportService } from '../../../services/report.service';
import { Report } from '../../../models/report.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
  standalone: false,
})
export class MapPage implements OnInit, AfterViewInit {
  private map: L.Map | undefined;
  private markers: L.Marker[] = [];
  reports: Report[] = [];
  loading = true;
  error: string | null = null;

  // Filtres
  selectedStatus: string = 'ALL';
  selectedCategory: string = 'ALL';

  statusOptions = [
    { value: 'ALL', label: 'Tous les statuts' },
    { value: 'OUVERT', label: 'Ouvert', color: '#dc2626' },
    { value: 'EN_COURS', label: 'En cours', color: '#ea580c' },
    { value: 'RESOLU', label: 'Résolu', color: '#16a34a' },
    { value: 'REJETE', label: 'Rejeté', color: '#6b7280' }
  ];

  categories = [
    { value: 'ALL', label: 'Toutes les catégories' },
    { value: 'VOIRIE', label: 'Voirie' },
    { value: 'ECLAIRAGE', label: 'Éclairage' },
    { value: 'PROPRETE', label: 'Propreté' },
    { value: 'SIGNALISATION', label: 'Signalisation' },
    { value: 'ESPACES_VERTS', label: 'Espaces verts' },
    { value: 'MOBILIER_URBAIN', label: 'Mobilier urbain' },
    { value: 'GRAFFITI', label: 'Graffiti' },
    { value: 'NIDS_DE_POULE', label: 'Nids de poule' },
    { value: 'AUTRE', label: 'Autre' }
  ];

  constructor(
    private reportService: ReportService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadReports();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  initMap() {
    // Configuration de Leaflet pour corriger les icônes
    const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
    const iconUrl = 'assets/leaflet/marker-icon.png';
    const shadowUrl = 'assets/leaflet/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    // Créer la carte centrée sur la Tunisie (Tunis)
    this.map = L.map('map').setView([36.8065, 10.1815], 13);

    // Ajouter le layer OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Ajouter les marqueurs
    this.addMarkersToMap();
  }

  loadReports() {
    this.loading = true;
    this.error = null;
    this.reportService.getReports({ page: 1, limit: 1000 }).subscribe({
      next: (res) => {
        this.reports = res.data;
        this.loading = false;
        if (this.map) {
          this.addMarkersToMap();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Impossible de charger les signalements';
        this.loading = false;
      }
    });
  }

  addMarkersToMap() {
    if (!this.map) return;

    // Supprimer les anciens marqueurs
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Filtrer les reports
    const filteredReports = this.reports.filter(report => {
      const statusMatch = this.selectedStatus === 'ALL' || report.status === this.selectedStatus;
      const categoryMatch = this.selectedCategory === 'ALL' || report.category === this.selectedCategory;
      return statusMatch && categoryMatch;
    });

    // Ajouter les marqueurs filtrés
    filteredReports.forEach(report => {
      const lat = report.location.coordinates.latitude;
      const lng = report.location.coordinates.longitude;

      // Créer une icône colorée selon le statut
      const markerIcon = this.createColoredIcon(report.status);

      const marker = L.marker([lat, lng], { icon: markerIcon })
        .addTo(this.map!)
        .bindPopup(this.createPopupContent(report));

      marker.on('click', () => {
        this.viewReportDetails(report._id);
      });

      this.markers.push(marker);
    });

    // Ajuster la vue pour afficher tous les marqueurs
    if (this.markers.length > 0) {
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  createColoredIcon(status: string): L.DivIcon {
    const colors: { [key: string]: string } = {
      'OUVERT': '#dc2626',
      'EN_COURS': '#ea580c',
      'RESOLU': '#16a34a',
      'REJETE': '#6b7280'
    };

    const color = colors[status] || '#6b7280';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }

  createPopupContent(report: Report): string {
    const statusLabel = this.statusOptions.find(s => s.value === report.status)?.label || report.status;
    return `
      <div style="min-width: 200px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px;">${report.title}</h3>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Catégorie:</strong> ${report.category}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Statut:</strong> ${statusLabel}</p>
        <p style="margin: 4px 0; font-size: 13px; color: #666;">${report.description.substring(0, 100)}...</p>
        ${report.imageUrl ? `<img src="${report.imageUrl}" style="width: 100%; height: 120px; object-fit: cover; margin-top: 8px; border-radius: 4px;" />` : ''}
        <p style="margin: 8px 0 0 0; font-size: 12px; color: #3b82f6; cursor: pointer;">Cliquez pour voir les détails →</p>
      </div>
    `;
  }

  onFilterChange() {
    this.addMarkersToMap();
  }

  centerOnUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map?.setView([lat, lng], 15);

          // Ajouter un marqueur pour la position de l'utilisateur
          L.marker([lat, lng], {
            icon: L.divIcon({
              className: 'user-location-marker',
              html: '<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5);"></div>',
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })
          }).addTo(this.map!)
            .bindPopup('Vous êtes ici')
            .openPopup();
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'obtenir votre position');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  }

  viewReportDetails(reportId: string) {
    this.router.navigate(['/report-detail', reportId]);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
