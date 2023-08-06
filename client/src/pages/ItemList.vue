<template>
  <div>
    <Header />
    <div class="q-ma-xl">
      <div class="page-title">Item List</div>

      <div class="search-filters">
        <q-input dense v-model="searchFilter.genericName" filled hint="Search by item name" debounce="900" clearable />
        <q-input dense v-model="searchFilter.newAssetCode" filled hint="Search by new asset code" debounce="900" clearable />
        <q-input dense v-model="searchFilter.itemId" filled hint="Search by row no." debounce="900" clearable />
        <q-select
          dense
          filled
          v-model="searchFilter.deptCode"
          emit-value
          map-options
          use-input
          input-debounce="900"
          hint="Search by department"
          :options="deptOptions"
          @filter="filterDept"
          borderless
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          dense
          filled
          v-model="searchFilter.categoryCode"
          emit-value
          map-options
          use-input
          input-debounce="900"
          hint="Search by category"
          :options="catOptions"
          @filter="filterCat"
          borderless
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          filled
          dense
          v-model="searchFilter.dateFrom"
          type="date"
          hint="Date from"
          clearable
        />
        <q-input
          filled
          dense
          v-model="searchFilter.dateTo"
          type="date"
          hint="Date to"
          clearable
        />
        <q-input dense v-model="searchFilter.itemCode" filled hint="Search by Item code" debounce="900" clearable />
        <q-input dense v-model="searchFilter.receivingReport" filled hint="Search by RR no." debounce="900" clearable />
        <q-select
          dense
          filled
          v-model="searchFilter.condemned"
          emit-value
          map-options
          use-input
          input-debounce="900"
          hint="Search condemned"
          :options="condemnedSelect"
          borderless
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-select
          dense
          filled
          v-model="searchFilter.salvaged"
          emit-value
          map-options
          use-input
          input-debounce="900"
          hint="Search salvaged"
          :options="salvagedSelect"
          borderless
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No results
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div>
        <q-table
          class="data-table"
          flat bordered
          title="Assets"
          :rows="itemData"
          :columns="columns"
          row-key="name"
          :loading="loading"
          :rows-per-page-options="[10]"
          separator="cell"
        >
          <template v-slot:top-right>
            <q-btn
              color="positive"
              icon-right="archive"
              label="Export to csv"
              no-caps
              @click="exportTable"
            />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props" @click="editItem(props.row.itemId)">

              <q-td key="genericName" :props="props">
                {{ props.row.genericName }}
              </q-td>

              <q-td key="newAssetCode" :props="props">
                {{ props.row.newAssetCode }}
              </q-td>

              <q-td key="itemId" :props="props">
                {{ props.row.itemId }}
              </q-td>

              <q-td key="deptCode" :props="props">
                {{ props.row.deptCode }}
              </q-td>

              <q-td key="categoryCode" :props="props">
                {{ props.row.categoryCode }}
              </q-td>

              <q-td key="itemCode" :props="props">
                {{ props.row.itemCode }}
              </q-td>

              <q-td key="receivingReport" :props="props">
                {{ props.row.receivingReport }}
              </q-td>

              <q-td key="unitCost" :props="props">
                ₱ {{ props.row.unitCost.toLocaleString('en-US') }}
              </q-td>

              <q-td key="setNo" :props="props">
                {{ props.row.setNo }}
              </q-td>

              <q-td key="dateReceived" :props="props">
                {{ this.format_date(props.row.dateReceived) }}
              </q-td>

              <q-td key="supplierName" :props="props">
                {{ props.row.supplierName }}
              </q-td>

              <q-td key="purchaseOrderNo" :props="props">
                {{ props.row.purchaseOrderNo }}
              </q-td>

              <q-td key="invoiceNo" :props="props">
                {{ props.row.invoiceNo }}
              </q-td>

              <q-td key="brandName" :props="props">
                {{ props.row.brandName }}
              </q-td>

              <q-td key="brandModel" :props="props">
                {{ props.row.brandModel }}
              </q-td>

              <q-td key="serialNo" :props="props">
                {{ props.row.serialNo }}
              </q-td>

              <q-td key="itemSpecs" :props="props">
                {{ props.row.itemSpecs }}
              </q-td>

              <q-td key="assetTagStatus" :props="props">
                <span v-if="props.row.assetTagStatus===true">Tagged</span>
              </q-td>

              <q-td key="itemRemarks" :props="props">
                {{ props.row.itemRemarks }}
              </q-td>

              <q-td key="oldAssetCode" :props="props">
                {{ props.row.oldAssetCode }}
              </q-td>

              <q-td key="physicalLocation" :props="props">
                {{ props.row.physicalLocation }}
              </q-td>

              <q-td key="condemned" :props="props">
                <span v-if="props.row.condemned===true">Condemned</span>
              </q-td>
              <q-td key="salvaged" :props="props">
                <span v-if="props.row.salvaged===true">Salvaged</span>
              </q-td>

            </q-tr>
          </template>
        </q-table>
      </div>

    </div>

    <!-- edit item modal -->
    <q-dialog v-model="editItemModalOpen" >
      <EditItemModal :id=editItemId :departments=deptList :categories=catList />
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { exportFile } from 'quasar';
import axios from 'axios';
import Header from '../components/Header.vue';
import EditItemModal from 'src/components/EditItemModal.vue';
import setToken from 'src/helpers/setToken';
import moment from 'moment';

export default defineComponent ({
  components: {
    Header,
    EditItemModal,
  },
  data() {
    return {
      columns: [
        {
          name: 'genericName',
          required: true,
          label: 'Generic Name',
          align: 'left',
          field: 'genericName',
          sortable: true
        },
        { name: 'newAssetCode', align: 'left', label: 'New Asset Code', field: 'newAssetCode', sortable: true },
        { name: 'itemId', align: 'left', label: 'Row No.', field: 'itemId', sortable: true },
        { name: 'deptCode', align: 'left', label: 'Department', field: 'deptCode', sortable: true },
        { name: 'categoryCode', align: 'left', label: 'Category', field: 'categoryCode', sortable: true },
        { name: 'itemCode', align: 'left', label: 'Item Code', field: 'itemCode', sortable: true },
        { name: 'receivingReport', align: 'left', label: 'RR No.', field: 'receivingReport', sortable: true },
        { name: 'unitCost', align: 'right', label: 'Unit Cost', field: 'unitCost', sortable: true },
        { name: 'setNo', align: 'left', label: 'Set No.', field: 'setNo', sortable: true },
        { name: 'dateReceived', align: 'left', label: 'Date Received', field: 'dateReceived', sortable: true },
        { name: 'supplierName', align: 'left', label: 'Supplier name', field: 'supplierName', sortable: true },
        { name: 'purchaseOrderNo', align: 'left', label: 'Purchase Order No.', field: 'purchaseOrderNo', sortable: true },
        { name: 'invoiceNo', align: 'left', label: 'Invoice No.', field: 'invoiceNo', sortable: true },
        { name: 'brandName', align: 'left', label: 'Brand Name', field: 'brandName', sortable: true },
        { name: 'brandModel', align: 'left', label: 'Brand Model', field: 'brandModel', sortable: true },
        { name: 'serialNo', align: 'left', label: 'Serial No.', field: 'serialNo', sortable: true },
        { name: 'itemSpecs', align: 'left', label: 'Item Specification', field: 'itemSpecs', sortable: true },
        { name: 'assetTagStatus', align: 'left', label: 'Asset Tag Status', field: 'assetTagStatus', sortable: true },
        { name: 'itemRemarks', align: 'left', label: 'Item Remarks', field: 'itemRemarks', sortable: true },
        { name: 'oldAssetCode', align: 'left', label: 'Old Asset Code', field: 'oldAssetCode', sortable: true },
        { name: 'physicalLocation', align: 'left', label: 'Physical Location', field: 'physicalLocation', sortable: true },
        { name: 'condemned', align: 'left', label: 'Condemned', field: 'condemned', sortable: true },
        { name: 'salvaged', align: 'left', label: 'Salvaged', field: 'salvaged', sortable: true },
      ],
      condemnedSelect: [
        { value: '1', label: 'Condemned' },
        { value: '0', label: 'Not Condemned' },
      ],
      salvagedSelect: [
        { value: '1', label: 'Salvaged' },
        { value: '0', label: 'Not Salvaged' },
      ],
      loading: false,
      url: `${process.env.API_HOST}/api/itemlist`,
      deptUrl: `${process.env.API_HOST}/api/getDept`,
      categoryUrl: `${process.env.API_HOST}/api/getCategory`,
      token: setToken().token,
      user: setToken().user,
      rights: setToken().rights,
      itemData: [],
      editItemModalOpen: false,
      editItemId: null,

      deptList: null,
      deptOptions: this.deptList,

      catList: null,
      catOptions: this.catList,

      // search filter variables
      searchFilter: {
        genericName: null,
        itemId: null,
        deptCode: null,
        categoryCode: null,
        dateFrom: null,
        dateTo: null,
        condemned: null,
        salvaged: null,
      },
      searchQuery: '',
    }
  },
  computed: {
    ...mapState([
      'departments',
      'categories',
    ]),
  },
  methods: {
    format_date(value){
      if (value) {
        return moment(String(value)).utcOffset('-0000').format('YYYY-MM-DD');
      }
    },
    warning(text, color) {
      this.$q.notify(
        {
          color: color,
          textColor: 'white',
          icon: 'warning',
          message: text,
        }
      );
    },
    writeQuery() {
      this.searchQuery = '?';
      const filterObj = Object.entries(this.searchFilter);

      for (const [k, v] of filterObj) {

        if(v != null && v != undefined && v!= '') {
          this.searchQuery += `${k}=${v}&`;
        }
      }
      this.getItems();
    },
    getItems: async function() {
      this.loading = true;
      const getItemsUrl = this.url;
      const token = this.token;
      const query = this.searchQuery;

      await axios.get(`${getItemsUrl}${query}`, { headers: {"Authorization" : `Bearer ${token}`} })
      .then(res => {
        if(res.status === 200 && res.data !== '') {
          this.itemData = res.data
        } else {
          this.warning('Failed to get data', 'red-5');
        }
      })
      .catch(err => {
        if(err.message === 'Network Error') {
          this.warning('Network Error', 'red-5');
        } else {
          this.warning('Error', 'red-5');
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.loading = false;
        }, 900);
      })
    },
    editItem(id) {
      this.editItemModalOpen = true;
      this.editItemId = id;
    },
    wrapCsvValue (val, formatFn, row) {
      let formatted = formatFn !== void 0
        ? formatFn(val, row)
        : val

      formatted = formatted === void 0 || formatted === null
        ? ''
        : String(formatted)

      formatted = formatted.split('"').join('""')
      /**
       * Excel accepts \n and \r in strings, but some other CSV parsers do not
       * Uncomment the next two lines to escape new lines
       */
      // .split('\n').join('\\n')
      // .split('\r').join('\\r')

      return `"${formatted}"`
    },
    exportTable () {
      // naive encoding to csv format
      const content = [this.columns.map(col => this.wrapCsvValue(col.label))].concat(
        this.itemData.map(row => this.columns.map(col => this.wrapCsvValue(
          typeof col.field === 'function'
            ? col.field(row)
            : row[ col.field === void 0 ? col.name : col.field ],
          col.format,
          row
        )).join(','))
      ).join('\r\n')

      const status = exportFile(
        'table-export.csv',
        content,
        'text/csv'
      )

      if (status !== true) {
        $q.notify({
          message: 'Browser denied file download...',
          color: 'negative',
          icon: 'warning'
        })
      }
    },
    filterDept (val, update) {
      if (val === '') {
        update(() => {
          this.deptOptions = this.deptList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.deptOptions = this.deptList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterCat (val, update) {
      if (val === '') {
        update(() => {
          this.catOptions = this.catList
        })
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.catOptions = this.catList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
      })
    },
  },
  mounted() {
    this.getItems();
    this.deptList = this.departments;
    this.catList = this.categories;
  },
  watch: {
    departments: function(value) {
      this.deptList = value;
    },
    categories: function(value) {
      this.catList = value;
    },
    searchFilter: {
      handler: function() {
        this.writeQuery();
      },
      deep: true,
    },
  }
})
</script>

<style>
.data-table {
  max-height: 90vh;
  max-width: 100%;
}

.data-table td:first-child{
  background: #F4F4F4;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.data-table tr th {
  position: sticky !important;
  z-index: 2;
  background: #F4F4F4;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.data-table thead tr:first-child th:nth-of-type(2) {
  border-left: none;
}

.data-table thead tr:first-child th {
  border-right: none;
}

.data-table thead tr:first-child th:first-child {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.data-table thead tr:last-child th {
  top: 48px;
  z-index: 3;
}

.data-table thead tr:first-child th {
  top: 0;
  z-index: 1;
}

.data-table tr:first-child th:first-child {
  z-index: 3;
}

.data-table td:first-child {
  z-index: 1;
}

.data-table td:first-child, th:first-child {
  position: sticky;
  left: 0;
}

.data-table tbody {
  scroll-margin-top: 48px
}
</style>
